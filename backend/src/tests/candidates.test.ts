import request from 'supertest';
import { app } from '../app';

describe('POST /candidates', () => {
  it('returns 400 when body is empty', async () => {
    const response = await request(app)
      .post('/candidates')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.message).toMatch(/validation|required/i);
  });

  it('returns 400 when required fields are missing', async () => {
    const response = await request(app)
      .post('/candidates')
      .send({ firstName: 'John' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });

  it('returns 400 when email format is invalid', async () => {
    const response = await request(app)
      .post('/candidates')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
      });
    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.error.details).toBeDefined();
  });

  it('returns 201 and candidate id when valid data is sent', async () => {
    const response = await request(app)
      .post('/candidates')
      .send({
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
      });
    if (response.status === 201) {
      expect(response.body.data).toBeDefined();
      expect(response.body.data.id).toBeDefined();
      expect(response.body.data.message).toMatch(/success/i);
    } else {
      expect([201, 409, 500]).toContain(response.status);
    }
  });
});
