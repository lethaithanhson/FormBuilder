"use client";

import React, { useState } from 'react'
import DesignerSidebar from './DesignerSidebar';
import { useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core"
import { cn } from '@/lib/utils';
import { ElementsType, FormElementInstance, FormElements } from './FormElements';
import useDesigner from './hooks/useDesigner';
import { idGenerator } from '@/lib/idGenerator';
import { BiSolidTrash } from 'react-icons/bi';
import { Button } from './ui/button';
import ScrollBar from './ScrollBar';

const Designer = () => {
    const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner()

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true
        }
    })

    useDndMonitor({
        onDragEnd(event) {
            const { active, over } = event
            if (!active || !over) return
            // active là btn
            const isDesignerBtnElement = active.data.current?.isDesignerBtnElement;
            // 
            const isDroppingOverDesignerDropArea = over.data.current?.isDesignerDropArea

            const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea
            //======== THÊM VÀO CUỐI MẢNG
            if (droppingSidebarBtnOverDesignerDropArea) {
                const type = active.data.current?.type
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                addElement(elements.length, newElement)
                return
            }

            // chèn trước
            const isDroppingOverDesignerElementTopHalf = over.data.current?.isTopHalfDesignerElement
            // Chèn sau
            const isDroppingOverDesignerElementBottomHalf = over.data.current?.isBottomHalfDesignerElement

            const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf
            const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement
            //========= THÊM VÀO VỊ TRÍ BẤT KỲ TRONG MẢNG
            if (droppingSidebarBtnOverDesignerElement) {
                const type = active.data.current?.type
                const newElement = FormElements[type as ElementsType].construct(
                    idGenerator()
                )

                const overElementIndex = elements.findIndex(e => e.id === over.data.current?.elementId)
                if (overElementIndex === -1) {
                    throw new Error("Element not found!")
                }
                // chèn trên elelement
                let indexForNewElement = overElementIndex
                // chèn dưới elelement
                if (isDroppingOverDesignerElementBottomHalf) {
                    indexForNewElement = overElementIndex + 1
                }

                addElement(indexForNewElement, newElement)
                return
            }
            // =========KÉO THẢ DI CHUYỂN VỊ TRÍ
            // active là element
            const isDroppingDesignerElement = active.data.current?.isDesignerElement;
            const isDroppingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDroppingDesignerElement
            if (isDroppingDesignerElementOverAnotherDesignerElement) {
                const activeId = active.data.current?.elementId
                const overId = over.data.current?.elementId

                const activeElementIndex = elements.findIndex(el => el.id === activeId)
                const overElementIndex = elements.findIndex(el => el.id === overId)

                if (overElementIndex === -1 || activeElementIndex === -1) {
                    throw new Error("Element not found!")
                }

                const activeElement = { ...elements[activeElementIndex] }
                removeElement(activeId)

                // chèn trên elelement
                let newIndex = overElementIndex
                // chèn dưới elelement
                if (isDroppingOverDesignerElementBottomHalf) {
                    newIndex = overElementIndex + 1
                }
                addElement(newIndex, activeElement)
            }
        },
    })

    return (
        <div className='flex w-full h-full'>
            <div className="p-4 w-full" onClick={() => {
                setSelectedElement(null)
            }}>
                <ScrollBar autoHeight autoHeightMin={'calc(100vh - 150px)'} direction='ltr' style={{
                    overflowX: 'hidden',
                }}>
                    <div
                        ref={droppable.setNodeRef}
                        className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow justify-start items-center flex-1",
                            droppable.isOver && "ring-2 ring-primary ring-inset")}
                            style={{
                                minHeight: 'inherit',
                            }}
                            >
                        {/* nếu không có elment và không kéo vô thì k hiện */}
                        {!droppable.isOver && elements.length === 0 && <p className="text-3xl text-muted-foreground flex flex-grow font-bold items-center">
                            Drop here
                        </p>}
                        {/* nếu không có elment và không kéo vô thì k hiện */}
                        {droppable.isOver && elements.length === 0 && (
                            <div className="p-4 w-full">
                                <div className="h-[120px] rounded-md bg-primary/20"></div>
                            </div>
                        )}
                        {elements.length > 0 && <div className="flex flex-col w-full gap-2 p-4">
                            {elements.map(element => (
                                <DesignerElementWrapper key={element.id} element={element} />
                            ))}
                        </div>}
                    </div>
                </ScrollBar>
            </div>
            <DesignerSidebar />
        </div>
    )
}

// 
const DesignerElementWrapper = ({ element }: { element: FormElementInstance }) => {
    const { removeElement, selectedElement, setSelectedElement } = useDesigner()
    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false)

    const topHalf = useDroppable({
        id: element.id + '-top',
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true
        }
    })

    const bottomHalf = useDroppable({
        id: element.id + '-bottom',
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true
        }
    })


    const draggable = useDraggable({
        id: element.id + '-draggable-handler',
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true
        }
    })

    // khi đang drag (kéo) thì không hiện 
    if (draggable.isDragging) return null

    const DesignerComponent = FormElements[element.type].designerComponent
    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="relative h-[110px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset"
            onMouseEnter={() => {
                setMouseIsOver(true)
            }}
            onMouseLeave={() => {
                setMouseIsOver(false);
            }}
            onClick={(e) => {
                e.stopPropagation()
                setSelectedElement(element)
            }}
        >
            {/* Đổi vị trí */}
            <div
                ref={topHalf.setNodeRef}
                className="absolute w-full h-1/2 rounded-t-md"
            ></div>
            <div
                ref={bottomHalf.setNodeRef}
                className="absolute w-full h-1/2 bottom-0 rounded-b-md"
            ></div>

            {/* Hover */}
            {mouseIsOver && <>
                <div className="absolute right-0 h-full">
                    <Button
                        variant={'outline'}
                        className='border rounded-md rounded-l-none bg-red-500 flex justify-center h-full'
                        onClick={(e) =>{
                            e.stopPropagation()
                            removeElement(element.id)
                        }}
                    >
                        <BiSolidTrash className="h-6 w-6" />
                    </Button>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                    <p className="text-muted-foreground text-sm">Click for properties or drag to move</p>
                </div>
            </>}

            {topHalf.isOver && (
                <div className="absolute top-0 w-full h-[7px] bg-primary rounded rounded-b-none"></div>
            )}

            <div className={cn("w-full h-[110px] flex items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none",
                mouseIsOver && "opacity-30"
            )}>
                <DesignerComponent elementInstance={element} />
            </div>

            {bottomHalf.isOver && (
                <div className="absolute bottom-0 w-full h-[7px] bg-primary rounded rounded-t-none"></div>
            )}
        </div>
    )
}

export default Designer