import { Request, Response } from 'express';
import {
  createCandidate,
  validateCandidateInput,
  validateCvFile,
} from '../services/candidateService';

export async function postCandidate(req: Request, res: Response): Promise<void> {
  try {
    const validation = validateCandidateInput(req.body);
    if (!validation.valid) {
      res.status(400).json({ error: { message: 'Validation failed', details: validation.errors } });
      return;
    }

    const cvError = validateCvFile(req.file);
    if (cvError) {
      res.status(400).json({ error: { message: cvError.message, details: [cvError] } });
      return;
    }

    const cvFile = req.file
      ? { path: req.file.path, originalname: req.file.originalname }
      : null;
    const result = await createCandidate(validation.data, cvFile);

    res.status(201).json({
      data: {
        id: result.id,
        message: 'Candidate added successfully',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to create candidate';
    if (String(message).includes('Unique constraint') || String(message).includes('email')) {
      res.status(409).json({ error: { message: 'A candidate with this email already exists' } });
      return;
    }
    res.status(500).json({ error: { message } });
  }
}
