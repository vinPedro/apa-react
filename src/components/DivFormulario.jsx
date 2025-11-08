export default function DivFormulario({maxWidth = 500, minWidth = 300, maxHeight = 400, children}){
    return(
        <div className="flex flex-col justify-center rounded-3xl shadow-[0_0px_10px_rgba(0,0,0,0.20)] m-1 py-[30px] w-full min-h-fit h-full"
            style={{maxWidth: maxWidth, minWidth: minWidth, maxHeight: maxHeight}}
        >
            {children}
        </div>
    )
}