import { expect } from 'chai';
import fetch from 'node-fetch';
import 'dotenv/config';

describe('API Route: /api/service', () => {
  const port = process.env.PORT || 3000;

  it('Erreur status 201 and valid JSON data', async () => {
    const response = await fetch(`http://localhost:${port}/api/service`);
    expect(response.status).to.equal(201);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Services récupéré avec succès');
    expect(responseData.existingServices).to.be.an('array');
  });
  
});
