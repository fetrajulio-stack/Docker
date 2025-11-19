 export interface User {
    id: number
    nom: string
    prenom: string
    email: string
    mdp: string
    roles: Roles
  }
  
  export interface Roles {
    id: number
    libele: string
    features: Feature[]
  }
  
  export interface Feature {
    id: number
    libelle: string
    pathname: string
  }
  