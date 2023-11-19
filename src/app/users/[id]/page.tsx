"use client"
import React, { useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
const SERVER_URL = "https://dinhu.com.br:3000"

const apiHeaders = (token: string) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  }
}

type UserData = {
  username?: string
  firstname?: string
  lastname?: string
  email?: string
  avatar?: string
}

const updateUserSchema = z.object({
  username: z.string().optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  email: z.string().email().optional(),
  avatar: z.string().optional(),
})

const UserEditView: React.FC<{ params: any }> = ({ params }) => {
  const userId = params.id
  const [userData, setUserData] = useState<UserData | null>(null)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<UserData>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    fetch(SERVER_URL + "/users/" + userId, {
      method: "GET",
      headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
    })
      .then((response) => response.json())
      .then((response) => setUserData(response.data))
      .catch((error) => console.error(error))
  }, [userId])

  const onSubmit: SubmitHandler<UserData> = (data) => {
    fetch(SERVER_URL + "/users/" + userId, {
      method: "PUT",
      headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.errors) {
          setError(response.errors[0].path[0], {
            message: response.errors[0].message,
          })
          return
        }
        toast.success("Usuário atualizado com sucesso!")
      })
      .catch((error) => console.error(error))
  }

  if (!userData) return <div>Loading...</div>

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        <button
          onClick={() => router.push("/")}
          className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Voltar para Home
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Username:</label>
            <input
              defaultValue={userData.username}
              {...register("username")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
            {errors.username && <p className="text-red-500 text-xs italic">{errors.username.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Primeiro nome:</label>
            <input
              defaultValue={userData.firstname}
              {...register("firstname")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
            {errors.firstname && <p className="text-red-500 text-xs italic">{errors.firstname.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Último nome:</label>
            <input
              defaultValue={userData.lastname}
              {...register("lastname")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
            {errors.lastname && <p className="text-red-500 text-xs italic">{errors.lastname.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Email:</label>
            <input
              defaultValue={userData.email}
              {...register("email")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Avatar:</label>
            <input
              defaultValue={userData.avatar}
              {...register("avatar")}
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
            />
            {errors.avatar && <p className="text-red-500 text-xs italic">{errors.avatar.message}</p>}
          </div>
          <hr />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Atualizar
          </button>
        </form>
      </div>
    </div>
  )
}

export default UserEditView
