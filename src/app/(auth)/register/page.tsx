"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Mail, Lock, User, Phone, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { register } from "@/actions/auth"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  contact: z.string().min(5, {
    message: "Contato deve ter pelo menos 5 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres.",
  }),
  confirmPassword: z.string().min(6, {
    message: "A confirmação deve ter no mínimo 6 caracteres.",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não conferem.",
  path: ["confirmPassword"],
})

export default function RegisterPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contact: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await register({
        name: values.name,
        contact: values.contact,
        email: values.email,
        password: values.password,
      })

      if (response.success) {
        toast.success(response.message)
        router.push("/login")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
        console.error(error);
        toast.error("Ocorreu um erro inesperado.")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      
      <Card className="w-full max-w-2xl bg-slate-900 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] text-slate-100 sm:rounded-xl overflow-hidden relative border">
         {/* Close button mimic */}
         <Link href="/login">
            <div className="absolute right-4 top-4 text-slate-400 cursor-pointer hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="6 6 18 18"/></svg>
            </div>
         </Link>

        <CardHeader className="space-y-1 flex flex-row items-center gap-3 pt-10 pb-6 px-10">
          <div className="bg-blue-600 rounded-full p-2 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
             <Plus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-200">
            Cadastrar
          </CardTitle>
        </CardHeader>
        <CardContent className="px-10 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-medium flex items-center gap-2">
                           <User className="w-4 h-4" /> Nome
                        </FormLabel>
                        <FormControl>
                          <Input 
                                placeholder="Nome Sobrenome" 
                                {...field} 
                                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg h-11"
                            />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-medium flex items-center gap-2">
                           <Phone className="w-4 h-4" /> Telefone / Celular
                        </FormLabel>
                        <FormControl>
                          <Input 
                                placeholder="(00) 0 0000-0000" 
                                {...field} 
                                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg h-11"
                            />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="col-span-1 md:col-span-2">
                        <FormLabel className="text-slate-300 font-medium flex items-center gap-2">
                           <Mail className="w-4 h-4" /> Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                                placeholder="seu@email.com" 
                                {...field} 
                                className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg h-11"
                            />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-medium flex items-center gap-2">
                           <Lock className="w-4 h-4" /> Senha
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="******" 
                            {...field} 
                            className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-medium flex items-center gap-2">
                           <Lock className="w-4 h-4" /> Confirmar Senha
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="******" 
                            {...field} 
                            className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg h-11"
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
              </div>
              
              <div className="pt-4 flex flex-col md:flex-row-reverse gap-3">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02]"
                  >
                    <Plus className="mr-2 h-5 w-5" /> Cadastrar
                  </Button>
                  
                  <Link href="/login" className="w-full md:w-auto">
                    <Button variant="outline" type="button" className="w-full bg-white text-blue-600 hover:bg-slate-100 border-none font-semibold py-6 rounded-lg transition-all">
                        <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-circle"><circle cx="12" cy="12" r="10"/><path d="M16 12H8"/><path d="M12 8l-4 4 4 4"/></svg>
                            Voltar
                        </span>
                    </Button>
                  </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
