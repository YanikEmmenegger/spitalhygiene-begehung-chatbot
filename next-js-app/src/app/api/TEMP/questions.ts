import {Question} from "@/types";

export const questions: Question[] = [
    {
        _id: "1",
        question: "Werden die Indikationen gemäss WHO oder bei Einsatz des Berner 3-Zonen-Modell eingehalten?",
        subcategory: {
            name: "Händehygiene",
            category: {
                name: "Standardhygienemassnahmen",
                description: ""
            }
        },
        critical: true,
        departments: ["Infektion", "Ambulant"],
        type: "Beobachtung"
    },
    {
        _id: "2",
        question: "Sind die Hände und Unterarme frei?",
        subcategory: {
            name: "Händehygiene",
            category: {
                name: "Standardhygienemassnahmen",
                description: ""
            }
        },
        critical: false,
        departments: ["Ambulant", "Infektion"], type: "Beobachtung"
    }
    ,
    {
        _id: "3",
        question: "Wird eine chir. Händedesinfection gemacht?",
        subcategory: {
            name: "Chirurgische Händedesinfektion",
            category: {
                name: "Standardhygienemassnahmen",
                description: ""
            }
        },
        critical: false,
        departments: ["Ambulant", "Infektion"], type: "Frage ärztliches Personal"
    }
    ,
    {
        _id: "4",
        question: "Werden Injektionsmedikamente umittelbar...?",
        subcategory: {
            name: "Infektions und Infusionsmassnahmen",
            category: {
                name: "Patientenbezogene Massnahmen",
                description: ""
            }
        },
        critical: false,
        departments: ["Ambulant", "Infektion"], type: "Frage Personal"
    },
    {
        _id: "5",
        question: "Werden Katheter nur bei klarer indikation eingesetzt?",
        subcategory: {
            name: "Injektion und Punktionen",
            category: {
                name: "Patientenbezogene Massnahmen",
                description: ""
            }
        },
        critical: true,
        departments: ["Ambulant", "Infektion"], type: "nicht anwendbar"
    }, {
        _id: "6",
        question: "Sind Einwegscherköpfe vorhanden?",
        subcategory: {
            name: "Infektions und Infusionsmassnahmen",
            category: {
                name: "Patientenbezogene Massnahmen",
                description: ""
            }
        },
        critical: false,
        departments: ["Ambulant", "Infektion"], type: "Frage Personal"
    },
    {
        _id: "7",
        question: "Sind verschiedene Modelle von einweg-OP Hauben vorhanden?",
        subcategory: {
            name: "Garderobe",
            category: {
                name: "Infrastruktur",
                description: ""
            }
        },
        critical: true,
        departments: ["Ambulant", "Infektion"], type: "Frage Personal"
    }
]
