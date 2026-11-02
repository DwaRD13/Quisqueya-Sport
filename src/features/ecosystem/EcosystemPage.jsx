import { useNavigate } from 'react-router-dom';
import BusinessCaseView from '../../components/BusinessCaseView.jsx';
import { TEAMS } from '../../data/mockData.js';

// Business pitch kept from the prototype; its buttons now route to the real pages.
export default function EcosystemPage() {
  const navigate = useNavigate();
  return <BusinessCaseView selectedTeam={TEAMS[0]} onNavigateTab={(tab) => navigate(tab === 'bopis' ? '/tienda' : '/videos')} />;
}
