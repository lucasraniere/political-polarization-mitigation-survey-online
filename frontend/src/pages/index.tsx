import PolarizationDef from "@/components/PolarizationDef";
import PoliticalLeaning from "@/components/index/PoliticalLeaning";
import SeguirButton from "@/components/index/SeguirButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
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
      <div className="div-p">
        Olá! Você está participando de um experimento que visa avaliar a percepção de usuários sobre características de polarização política presentes em textos de redes sociais. Serão apresentadas duas versões distintas de quatro textos retirados dessas plataformas, sendo que as duas versões terão diferenças na escrita. Sua tarefa consiste em analisar ambas as versões dos textos e responder a algumas questões, escolhendo a opção que melhor se adequar às suas percepções, dentre as alternativas fornecidas.
      </div>
      <PolarizationDef />
      <div className="div-p">
        Você poderá reler essa definição de textos polarizados a qualquer momento durante o survey, basta clicar no ícone de interrogação (?) presente no canto superior direito das próximas telas.
      </div>
      <div className="div-p">
        <strong>Você poderá ser exposto a tweets com conteúdo e temas sensíveis. Prossiga para a próxima etapa apenas se concorda em partiticapr do surve</strong>. Para iniciar o survey responda a questão abaixo e clique em seguir.
      </div>
      <div className="div-p">
        Qual das seguintes opções melhor definie seu posicionamento político?
      </div>
      <PoliticalLeaning changeHandler={setParticipantLeaning} />
      <SeguirButton clickHandler={nextButtonHandler} />
    </main>
  );
}
