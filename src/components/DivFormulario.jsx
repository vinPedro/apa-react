export default function DivFormulario({maxWidth = 500, minWidth = 350, children}){
    return(
        <div className="flex flex-col justify-center rounded-3xl shadow-[0_0px_10px_rgba(0,0,0,0.20)] m-1 py-[30px] w-full"
            style={{maxWidth: maxWidth, minWidth: minWidth}}
        >
            {children}
        </div>
    )
}