export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: DoctorSpecialty;
  available: boolean;
  rating: number;
  reviews: number;
  image: string;
}

export enum DoctorSpecialty {
  Terapevt = "Terapevt",
  AiləHekimi = "Ailə həkimi",
  Kardioloq = "Kardioloq",
  Nevroloq = "Nevroloq",
  Psixiatr = "Psixiatr",
  Psixoterapevt = "Psixoterapevt",
  UşaqPsixiatrı = "Uşaq psixiatrı",
  Pulmonoloq = "Pulmonoloq",
  Endokrinoloq = "Endokrinoloq",
  Ginekoloq = "Ginekoloq",
  Uroloq = "Uroloq",
  Nefroloq = "Nefroloq",
  Dermatoloq = "Dermatoloq",
  Onkoloq = "Onkoloq",
  Hematoloq = "Hematoloq",
  Revmotoloq = "Revmotoloq",
  Qastroenteroloq = "Qastroenteroloq",
  İnfeksionist = "İnfeksionist",
  Stomatoloq = "Stomatoloq",
  Pediatr = "Pediatr",
  Ortoped = "Ortoped",
  Travmatoloq = "Travmatoloq",
  Oftalmoloq = "Oftalmoloq",
  OtorinolarinqoloqLOR = "Otorinolarinqoloq (LOR)",
  Alerqoloq = "Alerqoloq",
  İmmunoloq = "İmmunoloq",
  AnestezioloqReanimatoloq = "Anestezioloq-reanimatoloq",
  Cərrah = "Cərrah",
  PlastikCərrah = "Plastik cərrah",
  ÜrəkDamarcərrahı = "Ürək-damar cərrahı",
  Neurocərrah = "Neurocərrah",
  Mamaginikoloq = "Mamaginikoloq",
  Radioloq = "Radioloq",
  LaboratorHekimi = "Laborator həkim",
  Patoloq = "Patoloq",
  Genetik = "Genetik",
  İşHekimiSənayeTəbabəti = "İş həkimi (sənaye təbabəti)",
  Reabilitoloq = "Reabilitoloq",
  Fizioterapevt = "Fizioterapevt",
}
