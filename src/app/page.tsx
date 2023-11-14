"use client"
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { toast } from "react-toastify"
import io from "socket.io-client"
import dynamic from "next/dynamic"
const Chart = dynamic(() => import("@/app/chartD"), { ssr: false })

const SERVER_URL = "http://localhost:3000"
const fetchApi = () => {
  fetch("http://localhost:3000/cassino")
    .then((response) => response.text())
    .then((data) => eval(data))
    .catch((error) => alert("Erro, recarregue a página!"))
}

const apiHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
}
/**
 * Football Studio
Fútbol Studio
Korean Dealer Baseball Studio
Türkçe Futbol Stüdyosu
 */

const patterns = {
  repete: {
    name: "Padrão 10 - Espelhamento",
    pattern: ["vvvvvv", "vvcvvc", "vccvcc", "vcvvcv", "cvvcvv", "cvccvc", "ccvccv", "cccccc"],
    rule: (pattern: string) => {
      return pattern[pattern.length - 1]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197233455599676/WhatsApp_Image_2023-11-03_at_13.44.23.jpeg?ex=65616499&is=654eef99&hm=a5bc0b654bd27d1608292c7c971d21fabd3b6a8b59867dbb649d1b4d52aa49e4&",
    alert: "Alta tendência de empate!",
  },
  treetree: {
    name: "Padrão 8: 3 para 3",
    pattern: ["vvvccc", "cccvvv"],
    rule: (pattern: string) => {
      return pattern[pattern.length - 1]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197233786966046/WhatsApp_Image_2023-11-03_at_13.44.23_8.jpeg?ex=65616499&is=654eef99&hm=42a47758de4f7e391e569c5116ac60b1b8af3ce15895b6ace9f97f4949a17c18&",
  },
  check: {
    name: "Padrão 4: Xeque mate",
    pattern: ["cvcvv", "vcvcc"],
    rule: (pattern: string) => {
      return pattern[0]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197234076364860/WhatsApp_Image_2023-11-03_at_13.44.23_7.jpeg?ex=65616499&is=654eef99&hm=c65bce04cc3699c85403bc015e5df498a409b62460c868bbeeff3b6d08e24b73&",
    alert: "Alta tendência de empate!",
  },
  pique: {
    name: "Padrão 9: Mantém o Pique",
    pattern: ["vvcvcvccccccv", "ccvcvcvvvvvvc"],
    rule: (pattern: string) => {
      return pattern[2]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197234420289616/WhatsApp_Image_2023-11-03_at_13.44.23_6.jpeg?ex=65616499&is=654eef99&hm=53578d36cb06561eb129cff2b3e7e222afea067675c29682c8a158f92a07877f&",
  },
  wave: {
    name: "PAdrão 2: Onda",
    pattern: ["cccccc", "vvvvvv"],
    rule: (pattern: string) => {
      return pattern[0] === "c" ? "v" : "c"
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197234755850332/WhatsApp_Image_2023-11-03_at_13.44.23_5.jpeg?ex=65616499&is=654eef99&hm=65edc057c3efc3e0e5f1e2c6093121a8af283e2082b9d19de3c45e7bdc745e68&",
  },
  chess: {
    name: "Padrão 3: Xadrez",
    pattern: ["vcvv", "cvcc"],
    rule: (pattern: string) => {
      return pattern[1]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197235372404827/WhatsApp_Image_2023-11-03_at_13.44.23_4.jpeg?ex=6561649a&is=654eef9a&hm=a3f0819feb251aebc835cf008c496c286eb8dd141437d2a5ba577936d948c032&",
  },
  twoToTwo: {
    name: "Padrão 5: 2 para 2",
    pattern: ["vvcc", "ccvv"],
    rule: (pattern: string) => {
      return pattern[pattern.length - 1]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197235737317426/WhatsApp_Image_2023-11-03_at_13.44.23_3.jpeg?ex=6561649a&is=654eef9a&hm=eef9465d4eab1e46bf330c9069d9b347dff66e83f44ab25d2e7448ebe4fc8a4e&",
    alert: "Alta tendência de empate!",
  },
  twoToTwoBreak: {
    name: "Padrão 6: Quebra do 2 para 2",
    pattern: ["cvvcc", "vccvv"],
    rule: (pattern: string) => {
      return pattern[1]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197236026716301/WhatsApp_Image_2023-11-03_at_13.44.23_2.jpeg?ex=6561649a&is=654eef9a&hm=10b676360c8f5d262023871bf5b198dbf9906c56e9bf71039cc651e6d0081248&",
    alert: "Alta tendência de empate!",
  },
  surf: {
    name: "Padrão 1: Surf",
    pattern: ["cvvvvvv", "vcccccc"],
    rule: (pattern: string) => {
      return pattern[1]
    },
    url: "https://cdn.discordapp.com/attachments/1098482108424519712/1170197236307726486/WhatsApp_Image_2023-11-03_at_13.44.23_1.jpeg?ex=6561649a&is=654eef9a&hm=3a21522ebda03cf4fcba6d6e402e8bcef9ea68bc6171b19474cc79050546d2e5&",
  },
}

const Main = () => {
  const [pageState, setPageState] = useState<"login" | "signup" | "page">("login")

  const setPageStateHandler = (state: "login" | "signup" | "page") => {
    setPageState(state)
  }

  const testToken = async () => {
    try {
      await fetch(SERVER_URL + "/auth", {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({ token: localStorage.getItem("dinhutoken") }),
      })
      setPageState("page")
    } catch (error) {
      setPageState("login")
    }
  }
  useEffect(() => {
    testToken()
  }, [])

  return (
    <div className="w-full">
      {pageState === "login" && <Login setPageState={setPageStateHandler} />}
      {pageState === "signup" && <Signup setPageState={setPageStateHandler} />}
      {pageState === "page" && <Page setPageState={setPageStateHandler} />}
    </div>
  )
}
export default Main

const Login: React.FC<{ setPageState: (state: "login" | "signup" | "page") => void }> = ({ setPageState }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(SERVER_URL + "/login", {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("dinhutoken", data.token)
        setPageState("page")
        toast.success("Login realizado com sucesso")
      })
      .catch((error) => {
        toast.error("Login Não autorizado")
      })
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md flex items-center flex-col">
        <div className="flex flex-col justify-center items-center p-4 w-[200px] h-[200px]">
          <img
            className="object-contain rounded-full border-2 border-red-500"
            src="https://cdn.discordapp.com/attachments/1098482108424519712/1173956739998167062/oficial.png?ex=6565d769&is=65536269&hm=f0a1992e60a4ecf57aea15a4decc5cb34aa312c5ff4c6fc907355e2c8b9e4b00&"
            alt=""
          />
        </div>
        <h2 className="text-lg font-semibold text-gray-700 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Login
          </button>
          <div className="flex justify-center items-center">
            <span className="text-gray-600 mr-3">Não tem conta?</span>
            <button
              type="button"
              onClick={() => {
                setPageState("signup")
              }}
              className="text-blue-600 hover:text-blue-900"
            >
              Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const Signup: React.FC<{ setPageState: (state: "login" | "signup" | "page") => void }> = ({ setPageState }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetch(SERVER_URL + "/signup", {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("dinhutoken", data.token)
        toast.success("Cadastro realizado com sucesso")
        setPageState("page")
      })
      .catch((error) => {
        toast.error("Erro ao fazer cadastro")
      })
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 max-w-sm w-full bg-white rounded-lg border border-gray-200 shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 text-center">Cadastro</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Cadastrar
          </button>
          <div className="flex justify-center items-center">
            <span className="text-gray-600 mr-3">Já tem conta?</span>
            <button
              type="button"
              onClick={() => {
                setPageState("login")
              }}
              className="text-blue-600 hover:text-blue-900"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

interface HeaderProps {
  userName: string
  tabs: Array<{ id: number; name: string; condition: boolean; fn: () => void }>
  onLogout: () => void
}

const Header: React.FC<HeaderProps> = ({ userName, tabs, onLogout }) => {
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
          <i className="h-[100%]  text-gray-600 mr-4 fa fa-user-circle flex items-center justify-center"></i>
          <button onClick={onLogout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

const Page: React.FC<{ setPageState: (state: "login" | "signup" | "page") => void }> = ({ setPageState }) => {
  const [socket, setSocket] = useState<any>(null)
  const [connectionId, setConnectionId] = useState("")
  const [patternsReceived, setPatternsReceived] = useState<any[]>([])
  const [pastPatterns, setPastPatterns] = useState<any[]>([])
  const [subPageState, setSubPageState] = useState<"triggers" | "admin">("triggers")

  useEffect(() => {
    // Connect to Socket.IO server
    const newSocket = io(SERVER_URL, { query: { token: localStorage.getItem("dinhutoken") } })
    setSocket(newSocket)

    newSocket.on("connect", () => {
      setConnectionId(newSocket.id)
    })

    newSocket.on("trigger", (message) => {
      setPatternsReceived([{ ...message, date: new Date().toISOString() }, ...patternsReceived])
    })

    return () => {
      newSocket.close()
    }
  }, [])

  useEffect(() => {
    if (!patternsReceived.length) return
    if (!patternsReceived[0].name || patternsReceived[0].name == "undefined") return
    // se o nome for o mesmo do primeiro de lá e a data for mais próxima que 30 segundos, return
    if (
      pastPatterns.length &&
      patternsReceived[0].name === pastPatterns[0].name &&
      new Date(patternsReceived[0].date).getTime() - new Date(pastPatterns[0].date).getTime() < 30000
    )
      return
    setPastPatterns((pastPatterns) => {
      return [patternsReceived[0], ...pastPatterns]
    })
  }, [patternsReceived])

  return (
    <div className="w-[100%] flex flex-col">
      <Header
        userName="Dinhu"
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
            condition: true,
            fn: () => {
              setSubPageState("admin")
            },
          },
        ]}
        onLogout={() => {
          localStorage.removeItem("dinhutoken")
          setPageState("login")
        }}
      />
      <span className="text-gray-100  flex items-center justify-center font-semibold bg-green-600 p-3 w-[100%]">
        ID da Sessão: {connectionId}
      </span>
      {subPageState === "triggers" && (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              navigator.clipboard.writeText(
                "(" + fetchApi.toString() + `)();(() => {localStorage.setItem("LSSessionId", "${connectionId}");})()`
              )
              toast.success("Analisador copiado com sucesso")
            }}
          >
            Copiar Analisador
          </button>
          <div className="flex flex-row justify-around">
            <div className="flex flex-col justify-center items-center p-4 w-[200px] h-[200px]">
              <img
                className="object-contain rounded-full border-2 border-red-500"
                src="https://cdn.discordapp.com/attachments/1098482108424519712/1173956739998167062/oficial.png?ex=6565d769&is=65536269&hm=f0a1992e60a4ecf57aea15a4decc5cb34aa312c5ff4c6fc907355e2c8b9e4b00&"
                alt=""
              />
            </div>
            <Triggers connectionId={connectionId} pattern={patternsReceived[0]} />
          </div>
          <Chart data={pastPatterns} />
        </>
      )}
      {subPageState === "admin" && <Admin />}
    </div>
  )
}

const Triggers: React.FC<{ connectionId: string; pattern: any }> = ({ connectionId, pattern }) => {
  return (
    <div className="p-4">
      {pattern ? (
        <TriggerComponent
          loading={false}
          data={{
            name: pattern.name,
            url: pattern.url,
            sequence: pattern.sequence || "",
            bet: Object.values(patterns)
              .find((p) => p.name === pattern.name)
              ?.rule(pattern.sequence),
          }}
        />
      ) : (
        <LoadingSpinner />
      )}
    </div>
  )
}

const TriggerComponent = ({ loading, data }: { loading: boolean; data: any }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-center items-center h-fit space-y-4">
      <h1 className="text-2xl font-bold">{data?.name}</h1>
      <h2 className="text-2xl font-bold flex flex-row items-center justify-center">
        Gatilho:
        <div
          className={`h-10 w-10 flex justify-center items-center m-1 ${
            data?.bet === "c" ? "bg-yellow-400" : "bg-blue-400"
          }`}
        >
          <span className="text-xl font-bold text-white">{data?.bet.toLocaleUpperCase()}</span>
        </div>
      </h2>
      <div className="flex">
        {data?.sequence.split("").map((letter: string, index: number) => (
          <div
            key={index}
            className={`h-10 w-10 flex justify-center items-center m-1 ${
              letter === "c" ? "bg-yellow-400" : "bg-blue-400"
            }`}
          >
            <span className="text-xl font-bold text-white">{letter.toLocaleUpperCase()}</span>
          </div>
        ))}
      </div>
      {data?.alert && (
        <div className="flex flex-col justify-center items-center bg-yellow-400 p-2 rounded-lg">
          <span className="text-xl font-bold text-gray-100">{data?.alert}</span>
        </div>
      )}
      <button
        onClick={() => {
          window.open(data?.url)
        }}
        className="flex flex-col justify-center items-center bg-red-400 p-2 rounded-lg hover:bg-red-500 "
      >
        <span className="text-xl font-bold text-gray-100">Ver Explicação</span>
        <img src={data?.url} alt={data?.name} className="h-[50px]" />
      </button>
    </div>
  )
}

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
    </div>
  )
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([])
  const [activeUsers, setActiveUsers] = useState<User[]>([])

  // make a useeffect that fetches /active-users in api every 10 seconds

  const fetchActiveUsers = async () => {
    try {
      const response = await fetch(SERVER_URL + "/active-sessions", {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({ token: localStorage.getItem("dinhutoken") }),
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
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify({ token: localStorage.getItem("dinhutoken") }),
      })
      const data = await response.json()
      setUsers(data?.items || [])
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
        headers: apiHeaders,
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
      <UserList users={users} onDelete={handleDelete} />
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
  onDelete: (id: string) => void
}

const UserList: React.FC<UserListProps> = ({ users, onDelete }) => {
  return (
    <div className="container mx-auto mt-5">
      <table className="min-w-full table-auto">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">ID</th>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
              <td className="px-6 py-4">{user.id}</td>
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4 text-right">
                {/* <button
                  className="font-semibold text-blue-600 hover:text-blue-900 mr-3"
                >
                  
                </button> */}
                {/* <button onClick={() => onDelete(user.id)} className="font-semibold text-red-600 hover:text-red-900">
                  Remover Acesso
                </button> */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
