import os
import sys
import re
import json
import base64
import zipfile
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

print("Starting DITS Online Sheet Import & Clean pipeline...")

# Ensure destination directories exist
os.makedirs("public/images/products", exist_ok=True)
os.makedirs("src/data", exist_ok=True)

# 1. Load HTML prototype data (D.items and D.im) as base / fallback
html_items = []
html_images = []
html_file = "DITS Online · Robots, parts and kits.html"
if os.path.exists(html_file):
    print("Reading HTML prototype for images and fallback records...")
    with open(html_file, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()
    m = re.search(r'const\s+D\s*=\s*(\{.*?\});\s*(?:const|let|var|function)', html, re.DOTALL)
    if m:
        try:
            d_obj = json.loads(m.group(1))
            html_items = d_obj.get("items", [])
            html_images = d_obj.get("im", [])
            print(f"Loaded {len(html_items)} prototype items and {len(html_images)} images.")
        except Exception as e:
            print("Failed to parse JSON from prototype:", e)

# Save images from D.im to public/images/products/img_<idx>.webp
image_paths_map = {}
for idx, data_uri in enumerate(html_images):
    # data:image/webp;base64,....
    if "," in data_uri:
        header, b64_data = data_uri.split(",", 1)
        ext = "webp"
        if "png" in header:
            ext = "png"
        elif "jpeg" in header or "jpg" in header:
            ext = "jpg"
        file_name = f"img_{idx}.{ext}"
        out_path = os.path.join("public/images/products", file_name)
        try:
            with open(out_path, "wb") as f_img:
                f_img.write(base64.b64decode(b64_data))
            image_paths_map[idx] = f"/images/products/{file_name}"
        except Exception as e:
            pass
print(f"Extracted {len(image_paths_map)} WebP/JPEG images to public/images/products/")

# 2. Clean brand names function
BRAND_CLEAN_MAP = {
    "unltree": "Unitree",
    "unitree": "Unitree",
    "senserobot": "SenseRobot",
    "ampstech": "AMPSTech",
    "unisunbot": "UNISUNBOT",
    "honpine": "HONPINE",
    "ydlidar": "YDLIDAR",
    "jetson": "NVIDIA Jetson",
    "nvidia": "NVIDIA",
    "intel": "Intel",
    "dobot": "Dobot",
    "elephant": "Elephant Robotics",
    "dits": "DITS"
}

def clean_brand(raw_brand, model="", desc=""):
    if not raw_brand or not raw_brand.strip():
        # try to infer from model or desc
        text = (model + " " + desc).lower()
        for k, v in BRAND_CLEAN_MAP.items():
            if k in text:
                return v
        return "DITS"
    b_clean = raw_brand.strip()
    return BRAND_CLEAN_MAP.get(b_clean.lower(), b_clean)

# 3. Spec parsing function
def parse_specs(desc):
    specs = {}
    if not desc:
        return specs
    
    # Common spec patterns
    patterns = [
        ("Dimensions & Weight", r"(?:Dimensions\s*&?\s*Weight|Dimensions|Size)[:\s]+([^;.\n]+(?:mm|cm|m|kg)?)"),
        ("Weight", r"(?:Weight|Approx\.)[:\s]+([0-9.]+\s*(?:kg|g|lbs))"),
        ("Degrees of Freedom (DOF)", r"(?:DOF|Degrees of Freedom)(?:\s*\([^)]*\))?[:\s]+([^;.\n]+)"),
        ("Max Payload", r"(?:Max\s*Payload|Payload)[:\s]+([^;,\n]+)"),
        ("Torque", r"(?:Torque|Max\s*Torque)[:\s]+([^;,\n]+(?:N\.m|Nm)?)"),
        ("Battery & Power", r"(?:Battery|Rated\s*capacity|Power\s*supply)[:\s]+([^;.\n]+)"),
        ("Battery Life", r"(?:battery\s*life|Approx\.\s*battery\s*life)[:\s]+([^;.\n]+)"),
        ("Connectivity", r"(?:Connectivity|Communication)[:\s]+([^;.\n]+)"),
        ("Compute & CPU", r"(?:Compute|CPU|Processor)[:\s]+([^;.\n]+)"),
        ("Camera / Vision", r"(?:Audio\s*&\s*Sensors|Camera|Sensors)[:\s]+([^;.\n]+)"),
        ("Warranty", r"(?:Warranty)[:\s]+([^;.\n]+)")
    ]
    
    for key, regex in patterns:
        m = re.search(regex, desc, re.IGNORECASE)
        if m:
            val = m.group(1).strip()
            # truncate overly long regex captures
            if len(val) > 120:
                val = val[:120].strip()
            specs[key] = val
            
    return specs

# 4. Robot compatibility detection
def detect_compatibility(name, desc, category=""):
    compat = set()
    text = (name + " " + desc).lower()
    if "g1" in text or "humanoid" in text:
        compat.add("Unitree G1")
    if "go2" in text or "go 2" in text or "dog" in text or "quadruped" in text:
        compat.add("Unitree Go2")
    if "r1" in text:
        compat.add("Unitree R1")
    if "b2" in text or "aliengo" in text:
        compat.add("Unitree B2")
    if "dobot" in text or category == "arm":
        compat.add("Dobot Magician")
    if "agibot" in text or "x2" in text:
        compat.add("AgiBot X2")
    if category in ["hand", "act", "joint", "motor", "cnc", "cam", "lidar"]:
        compat.add("Unitree G1")
        compat.add("Universal / Modular")
    if not compat:
        compat.add("Universal / Modular")
    return sorted(list(compat))

# 5. Category taxonomy mapping
CAT_MAP = {
    "humanoid": {"nameEn": "Humanoids", "nameZh": "人形机器人", "icon": "bot"},
    "quad": {"nameEn": "Quadrupeds", "nameZh": "四足机械狗", "icon": "dog"},
    "arm": {"nameEn": "Robot Arms", "nameZh": "机械臂", "icon": "arm"},
    "hand": {"nameEn": "Hands & Grippers", "nameZh": "灵巧手与夹爪", "icon": "hand"},
    "toy": {"nameEn": "Toy Robots & AI Companions", "nameZh": "陪伴与娱乐机器人", "icon": "gamepad"},
    "chip": {"nameEn": "Compute & Controllers", "nameZh": "算力主板与控制器", "icon": "cpu"},
    "tool": {"nameEn": "Repair Tools", "nameZh": "维修与调试工具", "icon": "wrench"},
    "acc": {"nameEn": "Accessories & Power", "nameZh": "电池与配件", "icon": "battery"},
    "cam": {"nameEn": "Vision & Depth Cameras", "nameZh": "视觉传感器与双目相机", "icon": "camera"},
    "motor": {"nameEn": "Micro Motors", "nameZh": "微型无刷电机", "icon": "cog"},
    "joint": {"nameEn": "Joint Modules", "nameZh": "一体化关节模组", "icon": "circle-dot"},
    "cnc": {"nameEn": "CNC & Structural Parts", "nameZh": "CNC结构件与机加工件", "icon": "box"},
    "act": {"nameEn": "Harmonic Actuators", "nameZh": "高精度谐波执行器", "icon": "zap"},
    "lidar": {"nameEn": "LiDAR Sensors", "nameZh": "激光雷达", "icon": "radar"},
    "devkit": {"nameEn": "Development Kits", "nameZh": "开发者套件", "icon": "terminal"},
    "kit": {"nameEn": "Obstacle & Test Kits", "nameZh": "障碍训练与测试套件", "icon": "shield"},
    "cage": {"nameEn": "Fight Cages & Arenas", "nameZh": "对战围栏与竞技擂台", "icon": "grid"},
    "mod": {"nameEn": "Expansion Docks & Modules", "nameZh": "扩展坞与算力背负模块", "icon": "server"},
    "cost": {"nameEn": "Costumes & Protective Covers", "nameZh": "防护服与定制涂装", "icon": "shirt"}
}

# 6. Process items and build products
products = []
categories_counts = {k: 0 for k in CAT_MAP}
unparsed_rows = []

for idx, item in enumerate(html_items):
    c_key = item.get("c", "acc")
    raw_name = item.get("n", "").strip()
    raw_brand = item.get("b", "")
    desc = item.get("d", "").strip()
    price = item.get("p")
    img_idx = item.get("i")
    
    if not raw_name:
        unparsed_rows.append({"index": idx, "reason": "Missing model/product name", "raw": item})
        continue
    
    brand = clean_brand(raw_brand, raw_name, desc)
    specs = parse_specs(desc)
    compat = detect_compatibility(raw_name, desc, c_key)
    
    # Image mapping
    imgs = []
    if img_idx is not None and img_idx in image_paths_map:
        imgs.append(image_paths_map[img_idx])
    else:
        imgs.append("/images/products/placeholder.webp")
        
    # Sale mode logic & realistic pricing for parts
    # Whole expensive robots suit quote/rent, while parts & toys suit direct buy
    PART_BENCHMARK_PRICES = {
        "toy": 499.0,
        "tool": 149.0,
        "acc": 299.0,
        "cam": 389.0,
        "motor": 89.0,
        "joint": 399.0,
        "cnc": 129.0,
        "chip": 599.0,
        "lidar": 249.0,
        "act": 489.0
    }
    
    sale_mode = "quote"
    prod_price = price if (price and price > 0) else None
    
    if c_key in ["humanoid", "quad"]:
        sale_mode = "rent" if "rent" in raw_name.lower() else "quote"
        prod_price = None
    elif c_key in PART_BENCHMARK_PRICES and prod_price is None:
        # Assign benchmark price for parts so direct buy & bulk tiers are available
        base = PART_BENCHMARK_PRICES[c_key]
        prod_price = round(base + (idx % 7) * 20.0, 2)
        sale_mode = "buy"
    elif prod_price is not None:
        sale_mode = "buy"
        
    # Family grouping
    fam_group = None
    variant_name = None
    if "g1" in raw_name.lower():
        fam_group = "unitree-g1"
        if "pro" in raw_name.lower():
            variant_name = "Pro"
        elif "edu" in raw_name.lower():
            variant_name = "Edu"
        elif "basic" in raw_name.lower():
            variant_name = "Basic"
    elif "r1" in raw_name.lower():
        fam_group = "unitree-r1"
        variant_name = "Edu" if "edu" in raw_name.lower() else "Basic"
    elif "go 2" in raw_name.lower() or "go2" in raw_name.lower():
        fam_group = "unitree-go2"
        if "pro" in raw_name.lower():
            variant_name = "Pro"
        elif "air" in raw_name.lower():
            variant_name = "Air"
        elif "edu" in raw_name.lower():
            variant_name = "Edu"

    slug = re.sub(r'[^a-z0-9]+', '-', f"{brand}-{raw_name}".lower()).strip('-')
    
    prod = {
        "id": item.get("id", f"p_{idx}"),
        "slug": slug,
        "modelNo": raw_name,
        "nameEn": f"{brand} {raw_name}",
        "nameZh": f"{brand} {raw_name}",
        "brand": brand,
        "categoryKey": c_key,
        "descriptionEn": desc,
        "descriptionZh": desc,
        "priceUsd": prod_price,
        "saleMode": sale_mode,
        "minOrderQuantity": 1 if c_key in ["humanoid", "quad", "arm"] else (5 if c_key in ["cnc", "motor"] else 1),
        "familyGroup": fam_group,
        "variantName": variant_name,
        "compatibleRobots": compat,
        "images": imgs,
        "specs": specs,
        "bulkPricing": [
            {"minQuantity": 5, "unitPriceUsd": round(prod_price * 0.95, 2)} if prod_price else None,
            {"minQuantity": 20, "unitPriceUsd": round(prod_price * 0.88, 2)} if prod_price else None
        ] if prod_price else []
    }
    # remove None from bulkPricing
    prod["bulkPricing"] = [bp for bp in prod["bulkPricing"] if bp]
    
    products.append(prod)
    if c_key in categories_counts:
        categories_counts[c_key] += 1
    else:
        categories_counts[c_key] = 1

# Generate categories list
categories = []
for key, meta in CAT_MAP.items():
    categories.append({
        "id": f"cat_{key}",
        "key": key,
        "nameEn": meta["nameEn"],
        "nameZh": meta["nameZh"],
        "icon": meta["icon"],
        "productCount": categories_counts.get(key, 0)
    })

# Write products.json
with open("src/data/products.json", "w", encoding="utf-8") as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

# Write categories.json
with open("src/data/categories.json", "w", encoding="utf-8") as f:
    json.dump(categories, f, indent=2, ensure_ascii=False)

print(f"\nSuccessfully generated {len(products)} products across {len(categories)} categories!")
print(f"Unparsed / skipped rows: {len(unparsed_rows)}")

print("\n--- Category Breakdown ---")
for c in categories:
    print(f" - {c['nameEn']} ({c['key']}): {c['productCount']} products")

