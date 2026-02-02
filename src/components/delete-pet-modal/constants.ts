export const COLORS = {
  background: {
    input: "#0F1629",
    calendar: "#00060F",
    gradient: "linear-gradient(316.01deg,#0E0014_15.31%,#001E4D_86.58%)",
    buttonGradient: "linear-gradient(90deg,#00CAFC_0%,#0056E2_100%)",
    iconGradient: "linear-gradient(135deg,#00CAFC_0%,#0056E2_100%)",
  },
  border: {
    default: "slate-700/50",
    focus: "blue-500",
    cyan: "cyan-500/50",
  },
  text: {
    primary: "slate-100",
    secondary: "slate-300",
    muted: "slate-600",
    error: "#ED254E",
  },
} as const

export const SIZES = {
  input: {
    height: "h-12",
    rounded: "rounded-xl",
  },
  icon: {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-10 h-10 md:w-12 md:h-12",
  },
  modal: {
    width: "w-[95%] md:w-full",
    maxWidth: "max-w-2xl",
  },
} as const

export const PLACEHOLDERS = {
  name: "Nome Sobrenome",
  ownerName: "Nome Sobrenome",
  breed: "Raça",
  phone: "(00) 0 0000-0000",
  birthDate: "22/08/2020",
  selectDate: "Selecione uma data",
} as const

export const LABELS = {
  name: "Nome",
  animal: "Animal",
  owner: "Dono",
  breed: "Raça",
  phone: "Telefone",
  birthDate: "Nascimento (Aproximado)",
  register: "Remover",
  back: "Voltar",
  registering: "Removendo...",
} as const

export const ICONS = {
  collar: "/collar-icon.svg",
  dna: "/dna.svg",
  user: "/user-icon.svg",
  phone: "/phone.svg",
  calendar: "/calendar.svg",
} as const
