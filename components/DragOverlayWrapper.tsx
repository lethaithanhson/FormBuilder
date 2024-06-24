import { useDndMonitor, Active, DragOverlay } from '@dnd-kit/core'
import React, { useState } from 'react'
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement'
import { ElementsType, FormElements } from './FormElements'
import useDesigner from './hooks/useDesigner'

const DragOverlayWrapper = () => {
    const {elements} = useDesigner()
    const [draggedItem, setDraggerItem] = useState<Active | null>(null)

    useDndMonitor({
        onDragStart(event) {
            setDraggerItem(event.active)
        },
        onDragCancel(event) {
            setDraggerItem(null)
        },
        onDragEnd(event) {
            setDraggerItem(null)
        },
    })

    if(!draggedItem) return null

    let node = <div>No drag overlay</div>
    // overlay cho nút (textField, checkbox,...)
    const isSidebarBtnElement = draggedItem.data.current?.isDesignerBtnElement
    if(isSidebarBtnElement){
        const type = draggedItem.data.current?.type as ElementsType
        node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />
    }

     // overlay cho các card bên design
     const isDesignerElement = draggedItem.data.current?.isDesignerElement
    if(isDesignerElement){
        const elemnentId = draggedItem.data.current?.elementId 
        const element = elements.find(el => el.id == elemnentId)
        if(!element){
            node = <div>Element not found!</div>
        }else {
            const DesignerElementComponent = FormElements[element.type].designerComponent
            node = <div className="flex w-full h-[110px] bg-accent py-2 px-4 border rounded-md opacity-80 pointer-events-none">
                 <DesignerElementComponent elementInstance={element} />
            </div>
        }
    }

    return (
        <DragOverlay>
            {node}
        </DragOverlay>
    )
}

export default DragOverlayWrapper