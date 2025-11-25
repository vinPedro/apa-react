import { useState } from 'react';

export function useViaCep(setFormData, setAlert) {
    const [loadingCep, setLoadingCep] = useState(false);

    // Estado para controlar individualmente quais campos ficam travados (read-only)
    const [camposTravados, setCamposTravados] = useState({
        logradouro: false,
        bairro: false,
        municipio: false,
        uf: false
    });

    const buscarCep = async (cep) => {
        // Remove caracteres não numéricos
        const cepLimpo = cep?.replace(/\D/g, '');

        if (!cepLimpo || cepLimpo.length !== 8) {
            return;
        }

        setLoadingCep(true);

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
            const data = await response.json();

            if (data.erro) {
                // SUBSTITUÍDO: alert("CEP não encontrado.");
                if (setAlert) {
                    setAlert({ message: "CEP não encontrado. Verifique o número.", variant: "warning" });
                }
                
                // Destrava tudo para o usuário digitar manualmente
                setCamposTravados({ logradouro: false, bairro: false, municipio: false, uf: false });
                return;
            }

            // Atualiza o formulário mantendo os outros dados
            setFormData((prev) => ({
                ...prev,
                logradouro: data.logradouro || "",
                bairro: data.bairro || "",
                municipio: data.localidade || "",
                uf: data.uf || "",
            }));

            // LÓGICA DE TRAVAMENTO:
            setCamposTravados({
                logradouro: !!data.logradouro,
                bairro: !!data.bairro,
                municipio: !!data.localidade,
                uf: !!data.uf
            });

        } catch (error) {
            console.error("Erro ao buscar CEP:", error);
            if (setAlert) {
                setAlert({ message: "Erro de conexão ao buscar CEP.", variant: "error" });
            }
            // Em caso de erro de conexão, destrava tudo
            setCamposTravados({ logradouro: false, bairro: false, municipio: false, uf: false });
        } finally {
            setLoadingCep(false);
        }
    };

    return { buscarCep, loadingCep, camposTravados };
}