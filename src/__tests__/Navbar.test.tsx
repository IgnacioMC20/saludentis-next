import { render, screen } from '@testing-library/react';
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
        
        const logo = screen.getByAltText('LOGO');
        expect(logo).toBeInTheDocument();


        const logoText = screen.getAllByText(/SALUDENTIS/i);
        expect(logoText).toHaveLength(2);
    });
});