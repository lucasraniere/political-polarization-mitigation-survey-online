import PolarizationDef from "@/components/PolarizationDef";
import PoliticalLeaning from "@/components/index/PoliticalLeaning";
import SeguirButton from "@/components/index/SeguirButton";

export default function Home() {
  return (
    <main>
      <div className="div-p">
        Olá! Você está participando de um experimento que visa avaliar a percepção de usuários sobre características de polarização política presentes em textos de redes sociais. Serão apresentadas duas versões distintas de quatro textos retirados dessas plataformas, sendo que as duas versões terão diferenças na escrita. Sua tarefa consiste em analisar ambas as versões dos textos e responder a algumas questões, escolhendo a opção que melhor se adequar às suas percepções, dentre as alternativas fornecidas.
      </div>
      <PolarizationDef />
      <div className="div-p">
        Você poderá reler essa definição de textos polarizados a qualquer momento durante o survey, basta clicar no ícone de interrogação (?) presente no canto superior direito das próximas telas.
      </div>
      <div className="div-p">
        Para iniciar o survey responda a questão abaixo e clique em seguir.
      </div>
      <div className="div-p">
        Qual das seguintes opções melhor definie seu posicionamento político?
      </div>
      <PoliticalLeaning />
      <SeguirButton />
    </main>
  );
}
