import { expect } from 'chai';
import fetch from 'node-fetch';
import 'dotenv/config';

describe('API Route: /api/employee', () => {
  const port = process.env.PORT || 3000;

  console.log(port);

  it('Récupérer les employées', async () => {
    const response = await fetch(`http://localhost:${port}/api/employee`);
    expect(response.status).to.equal(201);
    const responseData = await response.json();
    expect(responseData.message).to.equal('Employées récupéré avec succès');
    expect(responseData.existingEmployee).to.be.an('array');
  });
  
});
