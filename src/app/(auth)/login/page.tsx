"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { Mail, Lock } from "lucide-react" 

import { User } from "lucide-react"

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

const formSchema = z.object({
  email: z.email({
    message: "Por favor, insira um email válido.",
  }),
  password: z.string().min(6, {
    message: "A senha deve ter no mínimo 6 caracteres.",
  }),
})

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { login } from "@/actions/auth"

export default function LoginPage() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await login(values)
      
      if (response.success) {
        toast.success(response.message)
        router.refresh()
        router.push("/")
      } else {
        toast.error(response.message)
      }
    } catch (error) {
      console.error(error)
      toast.error("Ocorreu um erro inesperado.")
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
      {/* Background Elements to mimic the 'SoftPet' text and atmosphere if possible, 
          but for now just a clean dark background as per 'identical styling' instruction focus on the form. */}
      
      <Card className="w-full max-w-md bg-slate-900 border-blue-500/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] text-slate-100 sm:rounded-xl overflow-hidden relative border">


        <CardHeader className="space-y-1 flex flex-row items-center justify-center gap-3 pt-10 pb-6">
          <div className="bg-blue-600 rounded-full p-2 shadow-[0_0_15px_rgba(37,99,235,0.5)]">
             <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-200">
            Entrar
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium flex items-center gap-2">
                       <Mail className="w-4 h-4" /> Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                         {/* We could put icon inside input, but using Label icon for now to match 'Icon Title' style of labels in the image (e.g. 'Nome' has an icon) */}
                        <Input 
                            placeholder="seu@email.com" 
                            {...field} 
                            className="bg-slate-950/50 border-slate-700 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg h-11"
                        />
                      </div>
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
              
              <div className="pt-2 flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all hover:scale-[1.02]"
                  >
                    Entrar
                  </Button>
                  
                  <Link href="/register" className="w-full">
                    <Button variant="outline" type="button" className="w-full border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white py-6 rounded-lg transition-all">
                        Não tem conta? Cadastre-se
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
