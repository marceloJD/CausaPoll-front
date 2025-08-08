import EncuestaForm from '../components/EncuestaForm/EncuestaForm';
import { crearEncuesta } from '../services/EncuestasService';

const Home = () => {
  const onCrearEncuesta = async (datos) => {
    try {
        var res = await crearEncuesta(datos)
        //console.log(res)
        return res
    } catch (error) {
        console.log(error)
    }
   
  };

  return (
    <div className="container mt-5">
      <EncuestaForm onCrearEncuesta={onCrearEncuesta} />
    </div>
  );
};



export default Home;
