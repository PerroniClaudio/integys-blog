"use client";

import { UserLight } from "@/lib/types";
import { useEffect } from "react";
import useSWR from "swr";
import EditUserForm from "./EditUserForm";

type Props = {
  userId: string;
};

function AdminUserContent({userId}: Props) {

  const {
    data: user,
    isLoading: isUserLoading,
    mutate: mutateUser,
    error: userError 
  } = useSWR<UserLight>(`/api/users/${userId}`, (url: string) => {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .catch(err => {
        console.log(err);
        return {};
      });
  });

  

  return ((isUserLoading || userError) 
  ? (userError ? <div>Errore nel caricamento dei dati dell&apos;utente</div> : <div className="loading loading-spinner loading-lg text-primary" />)
  : !!user && <>
    <section className="col-span-8 flex gap-4">
      <div className="grid grid-cols-2 gap-4 bg-card rounded-lg p-4 m-auto max-w-screen-sm w-full">
        <div><span className="text-primary font-semibold">Creazione utenza: </span>{new Date(user.createdAt).toLocaleDateString()}</div>
        <div><span className="text-primary font-semibold">Ultima modifica: </span>{new Date(user.createdAt).toLocaleDateString()}</div>
        <div><span className="text-primary font-semibold">Grado: </span>{user.is_admin ? 'Amministratore' : 'Utente'}</div>
        <div><span className="text-primary font-semibold">Stato: </span>{user.is_deleted ? 'disabilitato' : (user.emailVerified ? 'abilitato' : 'attesa verifica email')}</div>
      </div>
    </section>
    <section className="col-span-8">
      <EditUserForm user={user} mutateUser={mutateUser} />
    </section>
  </>
  )
}

export default AdminUserContent