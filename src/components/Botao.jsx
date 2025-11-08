
export default function Botao({children, type = "submit", onClick, disabled = false, background="var(--color-botao)",  color="var(--color-text-botao)", maximo=170 }) {
    return (
            <button className={'text-botao py-2 px-2.5 rounded-lg transition duration-200 hover:brightness-110 hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed min-w-[130px] w-full'}
                style={{backgroundColor: background, color: color, maxWidth: maximo}}
                type={type}
                onClick={onClick}
                disabled={disabled}

            >{children}
            </button>
    )
}