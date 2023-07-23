
import { IconType } from "react-icons";
export function PrimaryButton(props: { onClick: React.MouseEventHandler<HTMLButtonElement>, children: React.ReactNode }) {
   return (
      <button 
         onClick={(event) => props.onClick!(event)} 
         className='m-auto h-12 rounded-lg px-4 text-background bg-primary p-[2px] focus:outline-none focus:ring-primary active:text-opacity-75 hover:z-10 hover:shadow-lg hover:translate-y-[-2px] hover:scale-[1.2] transition-all'
      >
         {props.children}
      </button>
   )
}

export function SecondaryButton(props: { onClick: React.MouseEventHandler<HTMLButtonElement>, children: React.ReactNode }) {
   return (
      <button 
         onClick={(event) => props.onClick!(event)} 
         className='m-auto h-12 inline-block border-2 border-primary rounded-lg text-primary dark:bg-secondary p-[2px] px-4 focus:outline-none focus:ring-primary active:text-opacity-75 hover:z-10 hover:shadow-lg hover:translate-y-[-2px] transition-all'
      >
         {props.children}
      </button>
   )
}

export function IconButton(props: { onClick: React.MouseEventHandler<HTMLButtonElement>, tooltip: string, className?: string, children: React.ReactElement<IconType> }) {
      return (
         <div className={"text-center translate-y-5 "+props.className}>
            <button 
               onClick={(event) => props.onClick(event)} 
               className='m-auto p-4 rounded-full text-secondary text-lg bg-primary font-bold focus:outline-none focus:ring-primary active:text-opacity-75 hover:z-10 hover:shadow-lg hover:scale-150 transition-all'
            >{props.children}</button>
            <div className="text-sm text-primary font-bold">{props.tooltip}</div>
         </div>
      )
}