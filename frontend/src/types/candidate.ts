export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
}

export interface CreateCandidateSuccess {
  data: {
    id: number;
    message: string;
  };
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface CreateCandidateError {
  error: {
    message: string;
    details?: ApiErrorDetail[];
  };
}
