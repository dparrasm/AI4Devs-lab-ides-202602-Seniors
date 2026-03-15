import type {
  CreateCandidateRequest,
  CreateCandidateSuccess,
  CreateCandidateError,
} from '../types/candidate';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3010';

export async function createCandidate(
  data: CreateCandidateRequest,
  cvFile: File | null
): Promise<CreateCandidateSuccess> {
  const formData = new FormData();
  formData.append('firstName', data.firstName);
  formData.append('lastName', data.lastName);
  formData.append('email', data.email);
  if (data.phone) formData.append('phone', data.phone);
  if (data.address) formData.append('address', data.address);
  if (data.education) formData.append('education', data.education);
  if (data.workExperience) formData.append('workExperience', data.workExperience);
  if (cvFile) formData.append('cv', cvFile);

  const response = await fetch(`${API_BASE}/candidates`, {
    method: 'POST',
    body: formData,
  });

  const json = await response.json();

  if (!response.ok) {
    const err = json as CreateCandidateError;
    throw new Error(err.error?.message || 'Failed to add candidate');
  }

  return json as CreateCandidateSuccess;
}
