import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; 
import { Navbar } from '@/components';
import { ThemeProvider, createTheme } from '@mui/material/styles';

describe('Navbar component', () => {
    it('renders Navbar component', () => {
        
        const theme = createTheme();
        
        render(
            <ThemeProvider theme={theme}>
                <Navbar />
            </ThemeProvider>
        );
        
        const logo = screen.getByAltText('Logo');
        expect(logo).toBeInTheDocument();


        const logoText = screen.getByText(/SALUDENTIS/i);
        expect(logoText).toBeInTheDocument();
    });
});