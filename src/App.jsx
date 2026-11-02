import { Link, Route, Routes } from 'react-router-dom';
import Layout from './shared/Layout.jsx';
import { EmptyState } from './shared/ui.jsx';
import HomePage from './features/home/HomePage.jsx';
import GamesPage from './features/games/GamesPage.jsx';
import GameDetail from './features/games/GameDetail.jsx';
import { StandingsPage, TeamDetail, TeamsPage } from './features/teams/TeamsPages.jsx';
import VideosPage from './features/videos/VideosPage.jsx';
import { CartPage, ProductDetail, StorePage } from './features/store/StorePages.jsx';
import StadiumsPage from './features/stadiums/StadiumsPage.jsx';
import PlansPage from './features/plans/PlansPage.jsx';
import SearchPage from './features/search/SearchPage.jsx';
import EcosystemPage from './features/ecosystem/EcosystemPage.jsx';
import CheckoutPage from './features/checkout/CheckoutPage.jsx';
import { LoginPage, RegisterPage, RequireAuth } from './features/account/AuthPages.jsx';
import { AccountPage, OrderPage } from './features/account/AccountPages.jsx';
import { PlanCheckoutPage } from './features/plans/PlansPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="partidos" element={<GamesPage />} />
        <Route path="partidos/:id" element={<GameDetail />} />
        <Route path="posiciones" element={<StandingsPage />} />
        <Route path="equipos" element={<TeamsPage />} />
        <Route path="equipos/:slug" element={<TeamDetail />} />
        <Route path="videos" element={<VideosPage />} />
        <Route path="tienda" element={<StorePage />} />
        <Route path="tienda/:id" element={<ProductDetail />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pedido/:id" element={<OrderPage />} />
        <Route path="ingresar" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="cuenta" element={<RequireAuth><AccountPage /></RequireAuth>} />
        <Route path="planes/:id/pagar" element={<RequireAuth><PlanCheckoutPage /></RequireAuth>} />
        <Route path="estadios" element={<StadiumsPage />} />
        <Route path="planes" element={<PlansPage />} />
        <Route path="buscar" element={<SearchPage />} />
        <Route path="ecosistema" element={<EcosystemPage />} />
        <Route path="*" element={<EmptyState title="Página no encontrada" action={<Link to="/" className="btn-primary">Ir al inicio</Link>} />} />
      </Route>
    </Routes>
  );
}
