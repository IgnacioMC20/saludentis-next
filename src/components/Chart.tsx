import { Box } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'

import { theme } from '@/themes'

const palette = [theme.celeste2, theme.celeste]

type ChartProps = {
    data: { id: number; value: number; label: string; }[];
};

const Chart: React.FC<ChartProps> = ({ data }) => {
    return (
        <Box width={'100%'} display={'flex'} justifyContent={'end'} alignItems={'end'}>
            <PieChart
                colors={palette}
                series={[
                    {
                        data,
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                ]}

                height={200}
                width={400}
            />
        </Box>
    )
}

export default Chart