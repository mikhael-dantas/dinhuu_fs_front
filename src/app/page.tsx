"use client"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import io from "socket.io-client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("@/app/chartD"), { ssr: false })

const SERVER_URL = "http://85.31.231.54:3000"
const fetchApi = () => {
  fetch("http://85.31.231.54:3000/cassino")
    .then((response) => response.text())
    .then((data) => eval(data))
    .catch((error) => alert("Erro, recarregue a página!"))
}

const apiHeaders = (token: string) => {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  }
}

export enum RolesEnum {
  ADMINISTRATION = "Administração",
  DIRECTORS = "Diretoria",
  MANAGERS = "Gerência",
  COLABORATORS = "Colaboradores",
  USERS = "Usuários",
}

// User interface
interface User {
  name: string
  username: string
  firstname: string
  lastname: string
  email: string
  password: string
  authority: RolesEnum[]
  avatar: string
  id: string
  active: boolean
  created_at: Date
  updated_at: Date
}

type ZodValidationError = {
  path: string[]

  message: string

  code: string

  fatal?: boolean
}
interface ResponseSchema {
  // errors in zod shape
  errors: ZodValidationError[]
  // unauthorized
  unauthorized?: string
  // unauthenticated
  unauthenticated?: string
  data?: any
  serverError?: string
}
/**
 * Football Studio
Fútbol Studio
Korean Dealer Baseball Studio
Türkçe Futbol Stüdyosu
 */

type PageState = "login" | "signup" | "page" | "landing"
const testTokenAndSetPage = async (setPageState: (value: PageState) => void) => {
  try {
    const res = await fetch(SERVER_URL + "/authcheck", {
      method: "GET",
      headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
    })
    const data: ResponseSchema = await res.json()
    if (data.data) {
      setPageState("page")
      return
    }
    if (data.unauthorized) {
      setPageState("login")
      return
    }
    if (data.unauthenticated) {
      setPageState("login")
      return
    }
    if (data.serverError) {
      setPageState("login")
      toast.error("Erro no servidor")
      return
    }
  } catch (error) {
    setPageState("login")
    toast.error("Erro desconhecido no servidor")
  }
}

//!COMPONENT
const MainComponent = () => {
  const [pageState, setPageState] = useState<PageState>("login")

  const setPageStateHandler = (state: PageState) => {
    const user = localStorage.getItem("user")
    if (!user) {
      setPageState("login")
      return
    }
    setPageState(state)
  }

  useEffect(() => {
    testTokenAndSetPage(setPageStateHandler)
  }, [])

  return (
    <div className="w-full">
      {pageState === "login" && <LoginComponent setPageState={setPageStateHandler} />}
      {pageState === "signup" && <SignUpComponent setPageState={setPageStateHandler} />}
      {pageState === "page" && <PageComponent setPageState={setPageStateHandler} />}
      {pageState === "landing" && <LandingComponent setPageState={setPageStateHandler} />}
    </div>
  )
}
export default MainComponent

const LandingComponent: React.FC<{ setPageState: (state: PageState) => void }> = ({ setPageState }) => {
  return <div>landing victor pendente</div>
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})
type SignInSchemaType = z.infer<typeof signInSchema>

//!COMPONENT
const LoginComponent: React.FC<{ setPageState: (state: PageState) => void }> = ({ setPageState }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignInSchemaType>({
    resolver: zodResolver(signInSchema),
  })
  const onSubmit = async (data: SignInSchemaType) => {
    try {
      await fetch(SERVER_URL + "/signIn", {
        method: "POST",
        headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.errors) {
            setError(data.errors[0].path[0], {
              message: data.errors[0].message,
            })
            return
          }
          localStorage.setItem("dinhutoken", data.data.accessToken)
          localStorage.setItem("user", JSON.stringify(data.data.user))
          toast.success("Login Efetuado")
          setPageState("page")
        })
        .catch((err) => {
          toast.error(err.message)
        })
    } catch (error) {
      toast.error("Erro desconhecido no servidor")
    }
  }

  return (
    <div className="flex flex-row items-center justify-between min-h-screen bg-gray-400 ">
      <div className="w-[100%] min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded shadow-md flex flex-col items-center">
          <div className="flex flex-col justify-center items-center p-4 w-[200px] h-[200px]">
            <img
              className="object-contain rounded-full border-2 border-red-500"
              src="https://cdn.discordapp.com/attachments/1098482108424519712/1173956739998167062/oficial.png?ex=6565d769&is=65536269&hm=f0a1992e60a4ecf57aea15a4decc5cb34aa312c5ff4c6fc907355e2c8b9e4b00&"
              alt=""
            />
          </div>
          <h2 className="mb-6 text-lg font-bold text-center">Olá, Seja bem vindo!!</h2>
          <p className="mb-4 text-sm text-center">Por favor realize o login para obter acesso</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{`${errors.email.message}`}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{`${errors.password.message}`}</p>}
            </div>

            <div className="flex items-center justify-between">
              {/* <a href="#" className="text-sm text-blue-600 hover:underline">
                Esqueceu sua senha?
              </a> */}
            </div>

            <button type="submit" className="w-full p-3 text-sm font-bold text-white bg-blue-600 rounded-md">
              Login
            </button>

            <div className="text-center">
              <p className="text-sm">
                Ainda não tem uma conta?{" "}
                <button
                  type={"button"}
                  onClick={() => {
                    setPageState("signup")
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

const signUpSchema = z.object({
  name: z.string(),
  username: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  email: z.string().email(),
  avatar: z.string(),
  password: z.string(),
})
type SignUpSchemaType = z.infer<typeof signUpSchema>
//!COMPONENT
const SignUpComponent: React.FC<{ setPageState: (state: PageState) => void }> = ({ setPageState }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
  })
  const onSubmit = async (data: SignUpSchemaType) => {
    try {
      const res = await fetch(SERVER_URL + "/signUp", {
        method: "POST",
        headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.errors) {
            setError(data.errors[0].path[0], {
              message: data.errors[0].message,
            })
            return
          }
          localStorage.setItem("dinhutoken", data.data.accessToken)
          localStorage.setItem("user", JSON.stringify(data.data.user))
          toast.success("Cadastro Efetuado")
          setPageState("page")
        })
        .catch((err) => {
          toast.error(err.message)
        })
    } catch (error) {
      toast.error("Erro desconhecido no servidor")
    }
  }

  return (
    <div className="flex flex-row items-center justify-between min-h-screen bg-gray-400">
      <div className="w-[100%] min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded shadow-md flex flex-col items-center">
          <div className="flex flex-col justify-center items-center p-4 w-[200px] h-[200px]">
            <img
              className="object-contain rounded-full border-2 border-red-500"
              src="https://cdn.discordapp.com/attachments/1098482108424519712/1173956739998167062/oficial.png?ex=6565d769&is=65536269&hm=f0a1992e60a4ecf57aea15a4decc5cb34aa312c5ff4c6fc907355e2c8b9e4b00&"
              alt=""
            />
          </div>
          <h2 className="mb-6 text-lg font-bold text-center">Olá, Seja bem vindo!!</h2>
          <p className="mb-4 text-sm text-center">Por favor realize o cadastro para obter acesso</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{`${errors.name.message}`}</p>}
            </div>

            <div>
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register("username")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.username && <p className="mt-1 text-xs text-red-600">{`${errors.username.message}`}</p>}
            </div>

            <div>
              <label htmlFor="firstname" className="text-sm font-medium">
                Primeiro Nome
              </label>
              <input
                id="firstname"
                type="text"
                {...register("firstname")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.firstname && <p className="mt-1 text-xs text-red-600">{`${errors.firstname.message}`}</p>}
            </div>

            <div>
              <label htmlFor="lastname" className="text-sm font-medium">
                Último Nome
              </label>
              <input
                id="lastname"
                type="text"
                {...register("lastname")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.lastname && <p className="mt-1 text-xs text-red-600">{`${errors.lastname.message}`}</p>}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="text"
                {...register("email")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{`${errors.email.message}`}</p>}
            </div>

            <div>
              <label htmlFor="avatar" className="text-sm font-medium">
                Url do Avatar
              </label>
              <input
                id="avatar"
                type="text"
                {...register("avatar")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.avatar && <p className="mt-1 text-xs text-red-600">{`${errors.avatar.message}`}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{`${errors.password.message}`}</p>}
            </div>

            <button type="submit" className="w-full p-3 text-sm font-bold text-white bg-blue-600 rounded-md">
              Cadastro
            </button>

            <div className="text-center">
              <p className="text-sm">
                Já tem uma conta?{" "}
                <button
                  type={"button"}
                  onClick={() => {
                    setPageState("login")
                  }}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

interface HeaderProps {
  userName: string
  avatar?: string
  tabs: Array<{ id: number; name: string; condition: boolean; fn: () => void }>
  onLogout: () => void
}

//!COMPONENT
const Header: React.FC<HeaderProps> = ({ userName, avatar, tabs, onLogout }) => {
  return (
    <header className="bg-white shadow w-full">
      <div className="mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex space-x-4">
          <img
            className="h-10 w-10"
            src="https://cdn.discordapp.com/attachments/1098482108424519712/1173970392805822494/20.png?ex=6565e420&is=65536f20&hm=a65b1daf8dcafac3e7e91e30077ae479b7cd17db9d526a02dadf5f89a7201162&"
            alt="Workflow"
          />
          {tabs.map((tab) =>
            tab.condition ? (
              <button
                key={tab.id}
                onClick={tab.fn}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {tab.name}
              </button>
            ) : null
          )}
        </div>

        <div className="flex items-center justify-center">
          <span className="text-gray-600 mr-3">{userName}</span>
          <img className="h-10 w-10 rounded-full" src={avatar || ""} alt="avatar" />

          <button onClick={onLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

//!COMPONENT
const PageComponent: React.FC<{ setPageState: (state: PageState) => void }> = ({ setPageState }) => {
  const [user, setUser] = useState<User | undefined>(undefined)
  const [socket, setSocket] = useState<any>(null)
  const [connectionId, setConnectionId] = useState("")
  const [patternsReceived, setPatternsReceived] = useState<any[]>([])
  const [pastPatterns, setPastPatterns] = useState<any[]>([])
  const [pastPatternsToChart, setPastPatternsToChart] = useState<any>({})
  const [subPageState, setSubPageState] = useState<"triggers" | "admin">("triggers")

  //! set user
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (!user) {
      setPageState("login")
      return
    }
    setUser(JSON.parse(user))
  }, [])

  //! Connect to Socket.IO server
  useEffect(() => {
    const newSocket = io(SERVER_URL, { query: { token: localStorage.getItem("dinhutoken") } })
    setSocket(newSocket)

    newSocket.on("connect", () => {
      setConnectionId(newSocket.id)
    })

    newSocket.on("trigger", (message) => {
      console.log(message)
      setPatternsReceived({ ...message, date: new Date().toISOString() })
    })

    return () => {
      newSocket.close()
    }
  }, [])

  //! Add new pattern to pastPatterns
  useEffect(() => {
    if (patternsReceived.length === 0) return
    setPastPatterns((pastPatterns) => {
      return [patternsReceived, ...pastPatterns]
    })
  }, [patternsReceived])

  useEffect(() => {
    if (pastPatterns.length === 0) return
    const allOtherInfo = pastPatterns.slice(1, pastPatterns.length)
    const allInfoParsed = allOtherInfo.reduce(
      (acc, curr) => {
        const matches = [...acc.matches, ...curr.matches]
        const semiMatches = [...acc.semiMatches, ...curr.semiMatches]
        const confirmedMatches = [...acc.confirmedMatches, ...curr.confirmedMatches]
        const failedMatches = [...acc.failedMatches, ...curr.failedMatches]
        return {
          matches,
          semiMatches,
          confirmedMatches,
          failedMatches,
          original: acc.original,
        }
      },
      {
        matches: [],
        semiMatches: [],
        confirmedMatches: [],
        failedMatches: [],
        original: pastPatterns[0].original,
      }
    )

    setPastPatternsToChart(allInfoParsed)
  }, [pastPatterns])

  if (!user) return null
  return (
    <div className="w-[100%] flex flex-col">
      <Header
        userName={user.username}
        avatar={user.avatar}
        tabs={[
          {
            id: 1,
            name: "Gatilhos",
            condition: true,
            fn: () => {
              setSubPageState("triggers")
            },
          },
          {
            id: 2,
            name: "Administração",
            condition: user.authority.includes(RolesEnum.ADMINISTRATION),
            fn: () => {
              setSubPageState("admin")
            },
          },
        ]}
        onLogout={() => {
          localStorage.removeItem("dinhutoken")
          localStorage.removeItem("user")
          setPageState("login")
        }}
      />
      <span className="text-gray-100  flex items-center justify-center font-semibold bg-green-600 p-3 w-[100%]">
        ID da Sessão: {connectionId}
      </span>
      {subPageState === "triggers" && (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex flex-row gap-4 items-center justify-center"
            onClick={() => {
              navigator.clipboard.writeText(
                "(" +
                  fetchApi.toString() +
                  `)();(() => {localStorage.setItem("LSSessionId", "${connectionId}");localStorage.setItem("LSToken", "${localStorage.getItem(
                    "dinhutoken"
                  )}")})()`
              )
              toast.success("Analisador copiado com sucesso")
            }}
          >
            <div className="flex flex-col justify-center items-center p-4 w-[8rem] h-[8rem]">
              <img
                className="object-contain rounded-full border-2 border-red-500"
                src="https://cdn.discordapp.com/attachments/1098482108424519712/1173956739998167062/oficial.png?ex=6565d769&is=65536269&hm=f0a1992e60a4ecf57aea15a4decc5cb34aa312c5ff4c6fc907355e2c8b9e4b00&"
                alt=""
              />
            </div>
            Copiar Analisador
          </button>
          {pastPatterns.length > 0 && (
            <>
              <div className="flex flex-row justify-around p-2">
                <TriggersGroup
                  info={pastPatterns.map((v) => {
                    return {
                      // order by the match that have most appearances on confirms
                      matches: v.matches.sort((a: any, b: any) => {
                        const aCount = v.confirmedMatches.filter((match: any) => match.name === a.name).length
                        const bCount = v.confirmedMatches.filter((match: any) => match.name === b.name).length
                        return bCount - aCount
                      }),
                      semiMatches: v.semiMatches,
                      confirmedMatches: v.confirmedMatches,
                      failedMatches: v.failedMatches,
                      original: v.original,
                    }
                  })}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <Chart
                  title={"Acertos"}
                  // pastel green
                  colors={["#77dd77"]}
                  data={pastPatternsToChart.confirmedMatches}
                />
                <Chart
                  title={"Erros"}
                  // pastel red
                  colors={["#ff6961"]}
                  data={pastPatternsToChart.failedMatches}
                />
                {/* count the quantity of non cv chars */}
                {/* <Chart
                  title={"Empates"}
                  // medium gray
                  colors={["#bfbfb4"]}
                  data={
                    pastPatternsToChart.original ||
                    "e"
                      .split("")
                      .filter((char: string) => char.toLowerCase() !== "c" && char.toLowerCase() !== "v")
                      .map((char: string) => {
                        return {
                          name: "Empate",
                          date: new Date().toISOString(),
                        }
                      })
                  }
                /> */}
              </div>
              {/* original sequence */}
              {pastPatterns.length > 0 && (
                <>
                  <h2 className="text-lg font-bold text-black my-1">Histórico</h2>
                  <div className="grid place-items-center m-1 grid-cols-9 max-w-[20rem]">
                    {pastPatterns[0].original.split("").map((letter: string, index: number) => (
                      <div
                        key={index}
                        className={`h-6 w-6 flex justify-center items-center m-1
                        ${
                          letter.toLowerCase() === "c"
                            ? "bg-red-400"
                            : letter.toLowerCase() === "v"
                            ? "bg-blue-400"
                            : "bg-gray-500"
                        }`}
                      >
                        <span className="text-md font-bold text-white">{letter.toLocaleUpperCase()}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
      {subPageState === "admin" && <Admin />}
    </div>
  )
}

type Pattern = {
  name: string
  rule: (sequence: string) => string
}

type Match = {
  sequence: string
  name: string
  rule: string
}

type SemiMatch = {
  sequence: string
  name: string
}

type ConfirmedMatch = {
  sequence: string
  name: string
  rule: string
}

type FailedMatch = {
  sequence: string
  name: string
  rule: string
}

type Info = {
  matches: Match[]
  semiMatches: SemiMatch[]
  confirmedMatches: ConfirmedMatch[]
  failedMatches: FailedMatch[]
  original: string
}
//!COMPONENT
const TriggersGroup = ({ info }: { info: Info[] }) => {
  const firstInfo = info[0]
  return (
    <div className="w-[100%]">
      <div className="grid grid-cols-2 md:grid-cols-3 w-[100%]">
        {/* info 1 */}
        <Trigger pattern={firstInfo.matches[0]} patternGroup={firstInfo.matches} />
        {firstInfo.semiMatches.length > 0 &&
          firstInfo.semiMatches.map((pattern) => <Trigger pattern={pattern} uncertain={true} />)}
      </div>
      {/* other info fails and confirmeds */}
      <h2 className="text-lg font-bold text-black my-1">Confirmações da última jogada</h2>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-cols-2">
          {firstInfo.confirmedMatches.length > 0 &&
            firstInfo.confirmedMatches.map((pattern) => <Trigger pattern={pattern} confirmed={true} onlyName={true} />)}
        </div>
        <div className="grid grid-cols-2">
          {firstInfo.failedMatches.length > 0 &&
            firstInfo.failedMatches.map((pattern) => <Trigger pattern={pattern} failed={true} onlyName={true} />)}
        </div>
      </div>
    </div>
  )
}
const Trigger: React.FC<{
  pattern: any
  patternGroup?: any[]
  onlyName?: boolean
  uncertain?: boolean
  confirmed?: boolean
  failed?: boolean
}> = ({ pattern: data, patternGroup, onlyName, uncertain = false, confirmed = false, failed = false }) => {
  return (
    <div className="p-1">
      <div
        className={`p-2 border rounded-md  text-white w-[100%]
      shadow-[0px_0px_10px_0px_black]
    ${
      uncertain
        ? "border-slate-600 bg-slate-300 animate-pulse"
        : confirmed
        ? "border-green-500 bg-gradient-to-br from-green-600 via-green-500 to-green-200"
        : failed
        ? "border-red-500 bg-gradient-to-br from-red-600 via-red-500 to-red-200"
        : "border-yellow-300 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-200 cursor-pointer min-h-[7rem]"
    }`}
      >
        <div className="flex flex-col justify-center items-center h-fit space-y-1">
          {!data?.name && <LoadingSpinner />}
          <h1 className="text-lg font-bold text-white">{data?.name}</h1>
          {data?.rule && !uncertain && !onlyName && (
            <h2 className="text-lg font-bold flex flex-row items-center justify-center text-white">
              <>
                Gatilho:
                <div
                  className={`h-9 w-9 flex justify-center items-center m-1 ${
                    data?.rule === "c" ? "bg-red-400" : data?.rule === "v" ? "bg-blue-400" : "bg-gray-500"
                  }`}
                >
                  <span className="text-xl font-bold text-white">{data?.rule.toLocaleUpperCase()}</span>
                </div>
              </>
            </h2>
          )}
          {!onlyName && (
            <div className="flex flex-wrap">
              {data?.sequence.split("").map((letter: string, index: number) => (
                <div
                  key={index}
                  className={`h-6 w-6 flex justify-center items-center m-1 ${
                    letter === "c" ? "bg-red-400" : letter === "v" ? "bg-blue-400" : "bg-gray-500"
                  }`}
                >
                  <span className="text-md font-bold text-white">{letter.toLocaleUpperCase()}</span>
                </div>
              ))}
            </div>
          )}
          {!onlyName && uncertain && (
            <h2 className="text-lg font-bold flex flex-row items-center justify-center text-white">
              <>Em formação</>
            </h2>
          )}
        </div>
      </div>
    </div>
  )
}

//!COMPONENT
const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[6rem]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
    </div>
  )
}

//!COMPONENT
const Admin = () => {
  const [users, setUsers] = useState<User[]>([])
  const [activeUsers, setActiveUsers] = useState<User[]>([])

  // make a useeffect that fetches /active-users in api every 10 seconds

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch(SERVER_URL + "/active-sessions", {
        method: "GET",
        headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
      })
      const data = await response.json()
      setActiveUsers(data?.activeSessions)
    } catch (error) {
      toast.error("Erro ao buscar usuários ativos")
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchActiveUsers()
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch(SERVER_URL + "/users", {
        method: "GET",
        headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
      })
      const data = await response.json()
      setUsers(data?.data || [])
    } catch (error) {
      toast.error("Erro ao buscar usuários")
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await fetch(SERVER_URL + "/users/" + id, {
        method: "DELETE",
        headers: apiHeaders(localStorage.getItem("dinhutoken") || ""),
      })
      toast.success("Usuário deletado com sucesso")
      fetchUsers()
    } catch (error) {
      toast.error("Erro ao deletar usuário")
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-center items-center rounded-xl bg-green-500 text-white p-2">
        Usuários ativos: {`${activeUsers}`}
      </div>
      <h1 className="text-2xl font-bold">Usuários</h1>
      <UserList users={users} onDelete={handleDelete} fetchUsers={fetchUsers} />
    </div>
  )
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface UserListProps {
  users: User[]
  fetchUsers: () => void
  onDelete: (id: string) => void
}

const UserList: React.FC<UserListProps> = ({ users, onDelete, fetchUsers }) => {
  return (
    <div className="container mx-auto mt-5">
      <button
        onClick={() => fetchUsers()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Refetch
      </button>
      <table className="min-w-full table-auto">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Nome</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Ativo</th>
            {/* <th className="px-6 py-3">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
              <td className="px-6 py-4">{user.id}</td>
              <td className="px-6 py-4">{user.username}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.active ? "Sim" : "Não"}</td>
              {/* <td className="px-6 py-4 text-right"> */}
              {/* <button
                  className="font-semibold text-blue-600 hover:text-blue-900 mr-3"
                >
                  
                </button> */}
              {/* <button onClick={() => onDelete(user.id)} className="font-semibold text-red-600 hover:text-red-900">
                  Remover Acesso
                </button> */}
              {/* </td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
