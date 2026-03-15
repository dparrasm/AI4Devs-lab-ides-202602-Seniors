import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface CreateCandidateInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  education?: string;
  workExperience?: string;
}

export interface ValidationError {
  field?: string;
  message: string;
}

export function validateCandidateInput(body: unknown): {
  valid: true; data: CreateCandidateInput;
} | { valid: false; errors: ValidationError[] } {
  if (typeof body !== 'object' || body === null) {
    return { valid: false, errors: [{ message: 'Request body must be an object' }] };
  }
  const b = body as Record<string, unknown>;
  const errors: ValidationError[] = [];

  const firstName = b.firstName;
  if (typeof firstName !== 'string' || firstName.trim() === '') {
    errors.push({ field: 'firstName', message: 'First name is required' });
  }
  const lastName = b.lastName;
  if (typeof lastName !== 'string' || lastName.trim() === '') {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  }
  const email = b.email;
  if (typeof email !== 'string' || email.trim() === '') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!EMAIL_REGEX.test(email)) {
    errors.push({ field: 'email', message: 'Email must be a valid format' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      firstName: (firstName as string).trim(),
      lastName: (lastName as string).trim(),
      email: (email as string).trim().toLowerCase(),
      phone: typeof b.phone === 'string' && b.phone.trim() !== '' ? b.phone.trim() : undefined,
      address: typeof b.address === 'string' && b.address.trim() !== '' ? b.address.trim() : undefined,
      education: typeof b.education === 'string' && b.education.trim() !== '' ? b.education.trim() : undefined,
      workExperience: typeof b.workExperience === 'string' && b.workExperience.trim() !== '' ? b.workExperience.trim() : undefined,
    },
  };
}

export function validateCvFile(file: Express.Multer.File | undefined): ValidationError | null {
  if (!file) return null;
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return { field: 'cv', message: 'CV must be PDF or DOCX' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { field: 'cv', message: 'CV file must be at most 5MB' };
  }
  return null;
}

export interface CvFileInfo {
  path: string;
  originalname: string;
}

export async function createCandidate(
  data: CreateCandidateInput,
  cvFile: CvFileInfo | null
): Promise<{ id: number }> {
  const candidate = await prisma.candidate.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone ?? null,
      address: data.address ?? null,
      education: data.education ?? null,
      workExperience: data.workExperience ?? null,
      cvPath: null,
    },
  });

  if (cvFile) {
    const uploadDir = getUploadDir();
    const fileName = sanitizeFileName(cvFile.originalname, candidate.id);
    const destPath = path.join(uploadDir, fileName);
    fs.renameSync(cvFile.path, destPath);
    const cvPath = path.relative(process.cwd(), destPath);
    await prisma.candidate.update({
      where: { id: candidate.id },
      data: { cvPath },
    });
  }

  return { id: candidate.id };
}

export function getUploadDir(): string {
  const dir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export function sanitizeFileName(originalName: string, candidateId: number): string {
  const ext = path.extname(originalName) || '';
  const safe = originalName.replace(/[^a-zA-Z0-9.-]/g, '_').slice(0, 50);
  return `candidate_${candidateId}_${Date.now()}${ext}`;
}
