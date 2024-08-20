import PolarizationDef from "@/components/PolarizationDef";
import PoliticalLeaning from "@/components/index/PoliticalLeaning";
import SeguirButton from "@/components/index/SeguirButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import exampleImg from '../figs/survey-example.jpg';
import LoadingMessage from "@/components/survey/LoadingMessage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [participantId, setParticipantId] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");
  const [participantLeaning, setParticipantLeaning] = useState<number>(0);

  const router = useRouter();

  // backend functions
  const checkParticipant = async (pId: string) => {
    const response = await fetch(`/api/check_participant/${pId}`);
    const data = await response.json();
    return data;
  };

  const addParticipant = async (pId: string) => {
    const response = await fetch('/api/add_participant/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'pId': pId})
    }).then((response) => {
      console.log(response);
    });
  };

  const setParticipantLeaningBack = async (pId: string, leaning: number) => {
    const response = await fetch('/api/set_participant_leaning/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'pId': pId, 'leaning': leaning})
    }).then((response) => {
      console.log(response);
    });
  }

  const addSession = async (pId: string, sId: string) => {
    const response = await fetch('/api/add_session/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({'pId': pId, 'sId': sId})
    }).then((response) => {
      console.log(response);
    });
  };

  // button handler
  const nextButtonHandler = () => {
    if (participantLeaning === 0) {
      alert("Por favor, selecione uma opção antes de prosseguir.");
    }
    else {
      setIsLoading(true);
      try {
        setParticipantLeaningBack(participantId, participantLeaning).then(() => {
          router.push(`/survey/?PROLIFIC_PID=${participantId}&SESSION_ID=${sessionId}`);
        });
      } catch (error) {
        console.error(error);
        router.push(`/?PROLIFIC_PID=${participantId}&SESSION_ID=${sessionId}`);
      }
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const pId = queryParams.get("PROLIFIC_PID") || "";
    const sesId = queryParams.get("SESSION_ID") || "";
    setParticipantId(pId || "");
    setSessionId(sesId || "");
    try {
      checkParticipant(pId).then((data) => {
        switch (data.status) {
          case false:
            addParticipant(pId).then(() => {
              addSession(pId, sesId);
            });
            break;
          case 'started':
            addSession(pId, sesId);
            break;
          case 'finished' || 'answered':
            if (sesId === "") {
              router.push(`/ending/?PROLIFIC_PID=${pId}`);
            } else {
              addSession(pId, sesId).then(() => {
                router.push(`/ending/?PROLIFIC_PID=${pId}`);
              });
            }
            break;
          default:
            addSession(pId, sesId).then(() => {
              router.push(`/survey/?PROLIFIC_PID=${pId}&SESSION_ID=${sesId}`);
            });
            break;
        }
      });
    } catch (error) {
      console.error(error);
      router.push(`/?PROLIFIC_PID=${pId}&SESSION_ID=${sesId}`);
    };
  }, []);

  return (
    <main>
      <div>
          {
            isLoading ? <LoadingMessage /> : null
          }
      </div>
      <h3>Introdução</h3>
      <div className="div-p">
        Olá! Você está participando de um experimento que tem como objetivo avaliar a percepção de usuários sobre características de polarização política presentes em textos (descritas abaixo) de redes sociais. Serão apresentadas duas versões de quatro textos distintos, retirados de plataformas de redes sociais, onde as versões terão diferenças na escrita. Sua tarefa consiste em analisar ambas versões dos textos e responder a algumas questões, escolhendo, dentre as alternativas fornecidas, a opção que melhor se adequar às suas percepções.
      </div>
      <h3>Definição de polarização em textos</h3>
      <PolarizationDef />
      <div className="div-p">
      Você poderá reler a definição de textos polarizados a qualquer momento durante o survey, basta clicar no ícone de interrogação (?) no canto superior direito das próximas telas.
      </div>
      <h3>Instruções</h3>
      <p>Caso opte por prosseguir com o survey, serão exibidas duas versões de quatro textos distintos e em sequência (uma dupla de cada vez). Para cada um dos textos, você verá uma tela similar à seguinte:</p>
      <Image className="img"
        src={exampleImg}
        alt="Exemplo de tela do survey"
        width={700}
      />
      <p>Após ler atenciosamente os dois textos, siga para as afirmações/questões abaixo dos textos. Leia cuidadosamente cada uma delas e marque a opção que você considera a mais correta. Todas as quatro telas nas quais você navegará terão as mesmas afirmações/questões e opções de respostas. As afirmações/questões são as seguintes:</p>
      <ol>
        <li>O texto 1 apresenta sinais de polarização;</li>
        <li>O texto 2 apresenta sinais de polarização;</li>
        <li>Os dois textos têm as mesmas ideias e temas centrais;</li>
        <li>Qual dos dois textos você considera ter um maior grau de polarização?</li>
      </ol>
      <p>Você navegará entre as páginas utilizando os botões de navegação presentes na parte de baixo de cada uma das quatro páginas. Você só poderá prosseguir para os próximos textos após marcar sua opção de resposta para cada afirmação/questão.</p>
      <div className="div-p">
        <strong>Você poderá ser exposto a textos que apresentem conteúdos e temas sensíveis. Prossiga para a próxima etapa apenas se concordar em participar do survey</strong>. Para iniciar o survey responda à questão abaixo e clique em seguir.
      </div>
      <div className="div-p">
        Qual das seguintes opções melhor define seu posicionamento político?
      </div>
      <PoliticalLeaning changeHandler={setParticipantLeaning} />
      <SeguirButton clickHandler={nextButtonHandler} />
    </main>
  );
}
