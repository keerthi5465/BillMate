import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  test('renders login page by default', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Sign in to BillMate/i)).toBeInTheDocument();
  });

  test('renders register link', () => {
    renderWithProviders(<App />);
    expect(screen.getByText(/Don't have an account\? Sign Up/i)).toBeInTheDocument();
  });
}); 