"use client";

//   id            String          @id @default(cuid())
//   email         String         @unique
//   password      String
//   emailVerified DateTime?
//   name          String?
//   surname       String?
//   phone       String?
//   occupation    String?
//   company       String?
//   company_address String?
//   is_admin        Boolean   @default(false)
//   is_deleted      Boolean   @default(false)

import { UserLight } from "@/app/lib/types"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

 
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
type Props = {
  // userId: string;
  user: UserLight;
  mutateUser: () => void;
};

// type UserUpdate = {
//   id: string;
//   email: string;
//   is_admin:  boolean;
//   is_deleted:  boolean;
//   name?: string;
//   surname?: string;
//   phone?: string;
//   occupation?: string;
//   company?: string;
//   company_address?: string;
// }

function EditUserForm({user, mutateUser = ()=>{}}: Props) {

  const [formData, setFormData] = useState<UserLight>({
    id: '',
    email: '',
    name: '',
    surname: '',
    phone: '',
    occupation: '',
    company: '',
    company_address: '',
    is_admin: false,
    is_deleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success(`Utente modificato con successo`);
        mutateUser();
      } else {
        toast.error(`Si è verificato un errore.`);
        const errorData = await response.json();
        console.log(errorData);
      }
    } catch (error) {
      toast.error(`Si è verificato un errore.`);
      console.log(error);
    } finally {
      mutateUser();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      // Altrimenti manda anche altri valori che non vogliamo gestire da qui
      // const filteredUser: UserUpdate = {
      //   id: user.id || '',
      //   email: user.email || '',
      //   name: user.name || '',
      //   surname: user.surname || '',
      //   phone: user.phone || '',
      //   occupation: user.occupation || '',
      //   company: user.company || '',
      //   company_address: user.company_address || '',
      //   is_admin: user.is_admin,
      //   is_deleted: user.is_deleted,
      // };
      // setFormData(filteredUser);
      setFormData(user);
    }
  }, [user]);
  
  useEffect(() => {
    console.log(formData);  
  }, [formData]);

  return (<div>
        {/* <form className="space-y-6 max-w-screen-sm m-auto" action="#" method="POST"> */}
        <form className="space-y-6 max-w-screen-sm m-auto bg-input rounded-lg p-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-primary">
              Nome
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                // className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="surname" className="block text-sm font-medium text-primary">
              Cognome
            </label>
            <div className="mt-1">
              <input
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleChange}
                required
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary">
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground">
              Telefono
            </label>
            <div className="mt-1">
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="occupation" className="block text-sm font-medium text-foreground">
              Lavoro
            </label>
            <div className="mt-1">
              <input
                id="occupation"
                name="occupation"
                type="text"
                value={formData.occupation}
                onChange={handleChange}
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground">
              Azienda
            </label>
            <div className="mt-1">
              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="company_address" className="block text-sm font-medium text-foreground">
              Indirizzo azienda
            </label>
            <div className="mt-1">
              <input
                id="company_address"
                name="company_address"
                type="text"
                value={formData.company_address}
                onChange={handleChange}
                className="rounded px-2 py-1 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="is_admin" className="order-1 block text-sm font-medium text-foreground">
              Admin
            </label>
            <div className="mt-1">
              <input
                id="is_admin"
                name="is_admin"
                type="checkbox"
                checked={formData.is_admin}
                onChange={handleChange}
                className="order-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="is_deleted" className="order-1 block text-sm font-medium text-foreground">
              Disabilitato
            </label>
            <div className="mt-1">
              <input
                id="is_deleted"
                name="is_deleted"
                type="checkbox"
                checked={formData.is_deleted ?? false}
                onChange={handleChange}
                className="order-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              Salva
            </Button>
          </div>
        </form>

      </div>
    
  )
}

export default EditUserForm