"use client";

import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { FormElementInstance } from "../FormElements";

type DesignerContextType = {
    elements: FormElementInstance[];
    setElements: Dispatch<SetStateAction<FormElementInstance[]>>,
    addElement: (index: number, element: FormElementInstance) => void;
    removeElement: (id: string) => void;

    selectedElement: FormElementInstance|null;
    setSelectedElement :Dispatch<SetStateAction<FormElementInstance | null>>

    updateElement:(id: string, element: FormElementInstance) => void
}

export const DesignerContext = createContext<DesignerContextType | null>(null)


export default function DesignerContextProvider({ children }: { children: ReactNode }) {
    const [elements, setElements] = useState<FormElementInstance[]>([])
    const [selectedElement, setSelectedElement] = useState<FormElementInstance | null>(null)


    // Thêm element vô form
    const addElement = (index: number, element: FormElementInstance) =>{
        setElements(prev => {
            const newElements = [...prev]
            newElements.splice(index, 0, element)
            return newElements
        })
    }

    // Xóa element
    const removeElement = (id:string)=>{
        setElements(prev => prev.filter(e=> e.id !== id))
        setSelectedElement(null)
    }

    // Cấu hình cho element
    const updateElement = (id:string, element: FormElementInstance) =>{
        setElements(prev =>{
            const newElements = [...prev]
            const index = newElements.findIndex(e=> e.id === id)
            newElements[index] = element
            return newElements
        })
    }

    return (
        <DesignerContext.Provider value={{
            elements,
            setElements,
            addElement,
            removeElement,

            selectedElement,
            setSelectedElement,

            updateElement
        }}>
            { children }
        </DesignerContext.Provider>
    )
}