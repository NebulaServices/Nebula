import { render } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import './themes/main.css';

export function App() {
	return (
		<LocationProvider>
			<div class="flex flex-col h-screen">
			<Header />
				<div class="flex-1 bg-primary">
					<main>
						<Router>
							<Route path="/" component={Home} />
							<Route default component={NotFound} />
						</Router>
					</main>
				</div>
			</div>
		</LocationProvider>
	);
}

render(<App />, document.getElementById('app'));
