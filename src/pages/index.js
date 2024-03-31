import Head from 'next/head';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link'
import 'dotenv/config';
const port = process.env.PORT || 3000;

export const getStaticProps = async () => {

  try {
    const res = await fetch('http://localhost:' + port + '/api/service')
    const services = await res.json()
    return { props: { services: services.existingServices } }
  } catch (error) {
    console.error('Erreur lors de la récupération des services :', error);
    return { props: { services: [] } }
  }
};

const Home = ({ services }) => {
  return (
    <div className="container w-full">
      <Head>
        <title>Services disponibles</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main className="container grid gap-4 grid-cols-3 w-full">
          {services.map((service) => (
            <Card key={service.id} >
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Durée: {service.duration} minutes</p>
                <p>Prix: {service.price} €</p>
              </CardContent>
              <CardFooter>
                <Link href={`/reservation/${service.id}`} className="bg-slate-900 text-white px-4 py-2 rounded-lg">Réserver</Link>
              </CardFooter>
            </Card>
          
          ))}

          
      </main>

      {services.length < 1 && (
            <div className='bg-red-200 p-4 rounded-sm w-full'>
              <p className='text-red-500'>Il n'y a aucun service</p>
            </div>
          )}
    </div>
  );
};

export default Home;