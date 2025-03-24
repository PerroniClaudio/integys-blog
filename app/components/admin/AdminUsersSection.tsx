"use client";

import useSWR from "swr";
import AdminUsersTable from "./AdminUsersTable"
import { UserLight } from "@/app/lib/types";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import Dialog from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function AdminUsersSection() {

  const [withDeleted, setWithDeleted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isVerified, setIsverified] = useState(false);
  const [editingUser, setEditingUser] = useState<UserLight | null>(null);
  const [editType, setEditType] = useState<"approve" | "recover" | "delete" | null>(null);
  const [isApproved, setIsApproved] = useState<boolean | null>(null);

  const { 
    data: users,
    isLoading: isUsersLoading,
    mutate: mutateUsers,
    error: usersError 
  } = useSWR<UserLight[]>('/api/users?with_deleted=' + (withDeleted ? 'true' : 'false') , (url: string) => {
    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => res.json())
      .catch(err => {
        console.log(err);
        return [];
      });
  });

  // disabilita
  const handleDisableUser = (userId: string) => {
    setEditingUser(users?.find(user => user.id === userId) ?? null);
    setEditType("delete");
    setIsOpen(true);
  }

  // approva o nega
  const handleApproveUser = (userId: string, isApprovedChoice: boolean) => {
    if(isApprovedChoice === null){toast.error("Errore: scelta non valida"); return;}
    setEditingUser(users?.find(user => user.id === userId) ?? null);
    setIsApproved(isApprovedChoice);
    setEditType("approve");
    setIsOpen(true);
  }

  // recupera
  const handleRecoverUser = (userId: string) => {
    setEditingUser(users?.find(user => user.id === userId) ?? null);
    setEditType("recover");
    setIsOpen(true);
  }

  const submitApproveUser = async () => {
    try {
      if(!editingUser) {
        throw new Error("Utente non trovato");
      }
      let response = await fetch(`/api/auth/register/approve`, {
      method: 'POST',
      body: JSON.stringify({ 
        id: editingUser?.id,
        is_approved: isApproved 
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      });

      if (response.ok) {
        toast.success(`${isApproved ? "Approvato" : "Annullata registrazione"} con successo`);
        mutateUsers();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error: any) {
      toast.error(`Error: ${error?.message}`);
    }
  }

  const submitRecoverUser = async () => {
    try {
      if(!editingUser) {
        throw new Error("Utente non trovato");
      }
      let response = await fetch(`/api/users/${editingUser?.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ is_deleted: false }),
      headers: {
        'Content-Type': 'application/json',
      },
      });

      if (response.ok) {
        toast.success(`Utente recuperato con successo`);
        mutateUsers();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error: any) {
      toast.error(`Error: ${error?.message}`);
    }
  }

  const submitDisableUser = async () => {
    try {
      if(!editingUser) {
        throw new Error("Utente non trovato");
      }
      let response = await fetch(`/api/users/${editingUser?.id}`, {
      method: 'DELETE',
      // body: JSON.stringify({ id: userId }),
      headers: {
        'Content-Type': 'application/json',
      },
      });

      if (response.ok) {
        toast.success(`Utente disabilitato con successo`);
        mutateUsers();
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error: any) {
      toast.error(`Error: ${error?.message}`);
    }
  }

  return (
    <div>
      {isUsersLoading ? <div className="loading loading-spinner loading-lg text-primary" /> : 
        <AdminUsersTable 
          users={users?.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0))} 
          mutateUsers={mutateUsers} 
          handleDisableUser={handleDisableUser}
          handleApproveUser={handleApproveUser}
          handleRecoverUser={handleRecoverUser} 
          withDeleted={withDeleted}
          setWithDeleted={setWithDeleted}
        />
      }

      <Dialog 
        title={editType == 'approve' ? (isApproved ? "Conferma registrazione" : "Annullamento registrazione") : (editType == 'recover' ? "Conferma recupero utenza" : "Conferma disabilitazione utente")}
        isOpen={isOpen}
        onClose={() => {setEditingUser(null); setIsApproved(null); setIsOpen(false)}}
      >
        <div className="dialog-content">
          <h3 className="font-semibold text-lg">
            {editType == 'approve' 
              ? "Sicuro di voler " + (isApproved ? "approvare" : "annullare") + " la registrazione dell'utente con email: " + (editingUser?.email ?? "")
              : (editType == 'recover'
                ? "Sicuro di voler recuperare l'utente con email: " + (editingUser?.email ?? "")
                : "Sicuro di voler disabilitare l'utente con email: " + (editingUser?.email ?? "") 
              )
            }
          </h3>
          <div className="flex justify-center gap-2 mt-4">
            {editType == 'approve'
              ? <Button onClick={()=>{submitApproveUser(); setIsOpen(false)}}>Conferma</Button>
              : (editType == 'recover'
                ? <Button onClick={()=>{submitRecoverUser(); setIsOpen(false)}}>Conferma</Button>
                : <Button onClick={()=>{submitDisableUser(); setIsOpen(false)}}>Conferma</Button>
              )
            }
            <Button onClick={()=>{setEditingUser(null); setIsApproved(null); setIsOpen(false)}}>Annulla</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default AdminUsersSection