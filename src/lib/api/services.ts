import {
  RentalInquiryRequest,
  RentalInquiryResponse,
  ResellerApplicationRequest,
  ResellerApplicationResponse,
  ServiceInquiryRequest,
  ServiceInquiryResponse,
} from '../../../contracts/types';
import { USE_MOCK_DATA, apiClient } from './client';

export async function submitRentalInquiry(
  req: RentalInquiryRequest
): Promise<RentalInquiryResponse> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const rentalInquiryId = `RENT-${new Date().getFullYear()}-${randomSuffix}`;

    if (typeof window !== 'undefined') {
      const records = JSON.parse(localStorage.getItem('dits_rental_inquiries') || '[]');
      records.unshift({
        rentalInquiryId,
        status: 'received',
        createdAt: new Date().toISOString(),
        req,
      });
      localStorage.setItem('dits_rental_inquiries', JSON.stringify(records));
    }

    return {
      rentalInquiryId,
      status: 'received',
      message: 'Rental inquiry received. Our fleet logistics coordinator will verify robot chassis availability and return an official proposal within 24 hours.',
    };
  }

  return apiClient<RentalInquiryResponse>('/services/rental/inquire', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export async function submitResellerApplication(
  req: ResellerApplicationRequest
): Promise<ResellerApplicationResponse> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const applicationId = `RES-${new Date().getFullYear()}-${randomSuffix}`;

    if (typeof window !== 'undefined') {
      const records = JSON.parse(localStorage.getItem('dits_reseller_applications') || '[]');
      records.unshift({
        applicationId,
        status: 'submitted',
        createdAt: new Date().toISOString(),
        req,
      });
      localStorage.setItem('dits_reseller_applications', JSON.stringify(records));
    }

    return {
      applicationId,
      status: 'submitted',
      message: 'Authorized Reseller application submitted. Our Channel Partner Director will review your business credentials and schedule an onboarding call.',
      estimatedReviewDays: 2,
    };
  }

  return apiClient<ResellerApplicationResponse>('/services/reseller/apply', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export async function submitServiceInquiry(
  req: ServiceInquiryRequest
): Promise<ServiceInquiryResponse> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 350));
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inquiryId = `SRV-${new Date().getFullYear()}-${randomSuffix}`;

    if (typeof window !== 'undefined') {
      const records = JSON.parse(localStorage.getItem('dits_service_inquiries') || '[]');
      records.unshift({
        inquiryId,
        status: 'received',
        createdAt: new Date().toISOString(),
        req,
      });
      localStorage.setItem('dits_service_inquiries', JSON.stringify(records));
    }

    return {
      inquiryId,
      status: 'received',
      message: 'Service inquiry dispatched directly to certified robotics application engineers.',
    };
  }

  return apiClient<ServiceInquiryResponse>('/services/inquire', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}
