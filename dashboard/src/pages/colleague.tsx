import ColleagueLayout from "../layouts/ColleagueLayout";
import Page from "../components/Page/Page";
import useColleague from "../hooks/useColleagueV2";
import { useParams } from "react-router-dom";

function Colleague() {
  const { colleagueId } = useParams();

  const { getColleague } = useColleague();
  const { colleague, loading } = getColleague(colleagueId);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Page name={"Colleague"} />
      <ColleagueLayout colleague={colleague} loading={loading} />
    </>
  );
}
export default Colleague;
