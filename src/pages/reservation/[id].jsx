import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useRouter } from 'next/router'
import { PrismaClient } from '@prisma/client';
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import moment from 'moment';
import 'moment-range';
import 'dotenv/config';
const BASE_URL = process.env.BASE_URL || 3000;

import { useToast } from "@/components/ui/use-toast"

const prisma = new PrismaClient();
export const getStaticPaths = async () => {
  return {
    paths: [
      {
        params: {
          id: 'id',
        },
      }, 
    ],
    fallback: true, 
  }
};

export const getStaticProps = async () => {

  try {
    const res = await fetch(BASE_URL + '/api/employee')
    const employees = await res.json()
    return { props: { employees: employees.existingEmployee } }
  } catch (error) {
    console.error('Erreur lors de la récupération des employées :', error);
  }
};
 
export default function Page({ employees }) {
  const router = useRouter();
  const { id } = router.query;
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedPlanning, setSelectedPlanning] = useState(0);
  const [date, setDate] = useState();
  const [time, setTime] = useState()
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [employee, setEmployee] = useState(0);
  const service = id;
  const [horaireEmployee, setHoraireEmployee] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const generateTimeSlots = () => {
      const slots = [];
      const startTime = moment('09:00', 'HH:mm');
      const endTime = moment('17:00', 'HH:mm');

      let currentTime = startTime.clone();
      while (currentTime.isBefore(endTime)) {
        slots.push(currentTime.format('HH:mm'));
        currentTime.add(30, 'minutes');
      }

      return slots;
    };

    setTimeSlots(generateTimeSlots());
  }, []);


  useEffect(() => {
    handleEmployeeChange(employee);
  }, [date, employee]);

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/reservation', {
        lastName,
        firstName,
        email,
        phone,
        notes,
        date: date?.toISOString(),
        time,
        employee,
        service
      });

      await handleEmployeeChange(employee);

      toast({title: "Succès", description: "Réservation effectuée avec succès"})
    } catch (error) {
      console.error('Erreur lors de la réservation :', error);
      toast({
        variant: "destructive",
        title: "Une erreur est survenue lors de la réservation",
      });
    }
  };

  const handleEmployeeChange = async (employeeId) => {

    if(date && employee){
      try {
        const response = await axios.get(`/api/employee/appointment/${employeeId}`);
        let newArray = [];
        const formattedDate = date.toISOString().split('T')[0];

        if (response?.data?.length > 0) {
          response?.data?.forEach((e) => {
              let splitedDateTime = e.date.split("T");
              let splitedDate = splitedDateTime[0];

              if(formattedDate == splitedDate){
                let splitedTime = splitedDateTime[1].split(":");
                let horaire = splitedTime[0] + ":" + splitedTime[1];
                newArray.push(horaire);
              }
              
          })
        }

        setHoraireEmployee(newArray)

    } catch (error) {
        console.error('Erreur lors de la récupération des créneaux réservés :', error);
    }
    }
    
  };

  if (!employees) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className='mb-8'>
        <label className='mb-8'>Choisissez un employée</label>
        <div  className='relative'>
        <Select onValueChange={(val) => setEmployee(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selectionner un employée" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Employée</SelectLabel>
              {employees?.map((el, i) => (
                <SelectItem value={el?.id} key={i}>{el?.name}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
      </div>

      <div className='mb-8'>
        <label className='mb-8'>Choisissez une date</label>
        <div  className='relative'>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Choisissez une date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"  
              selected={date}
              onSelect={setDate}
              fromYear={2024} 
              toYear={2026}
              initialFocus
            />
          </PopoverContent>
    </Popover>
        </div>
      </div>

      {employee && date && (
        
      <div className='mb-8'>
        <label className='mb-8'>Choisissez un créneau</label>
        <div className='py-5 flex gap-4 flex-wrap'>
        {timeSlots
            .filter((slot) => !horaireEmployee.includes(slot))
            .map((slot, index) => (
              <label
                key={index}
                htmlFor={`radio-${index}`}
                className={`bg-slate-200 p-2 rounded-lg text-black ${
                  selectedPlanning == index ? ' bg-stone-950 text-slate-100' : ''
                }`}
                onClick={() => {
                  setSelectedPlanning(index);
                  setTime(slot);
                }}
              >
                <input type='radio' id={`radio-${index}`} name='radio' value={slot + ':00.000Z'} className='hidden field' />
                {slot}
              </label>
          ))}
        </div>
      </div>
      )}
      <div className="mb-8">
      <label className='mb-8'>Nom</label>
        <Input type="text" placeholder="Nom" className="field" onInput={(e) => setLastName(e.target.value)}/>
      </div>
      <div className="mb-8">
      <label className='mb-8'>Prénom</label>
        <Input type="text" placeholder="Prénom" className="field" onInput={(e) => setFirstName(e.target.value)} />
      </div>
      <div className="mb-8">
      <label className='mb-8'>Email</label>
        <Input type="email" placeholder="Email" className="field" onInput={(e) => setEmail(e.target.value)} />
      </div>
      <div className="mb-8">
      <label className='mb-8'>Téléphone</label>
        <Input type="text" placeholder="N° de téléphone" className="field" onInput={(e) => setPhone(e.target.value)} />
      </div>
      <div className="mb-8">
      <label className='mb-8'>Notes</label>
        <Textarea placeholder="Notes..." className="field" onInput={(e) => setNotes(e.target.value)} />
      </div>
      <Button onClick={() =>  handleSubmit()}>Réserver</Button>
    </>
  );
}
