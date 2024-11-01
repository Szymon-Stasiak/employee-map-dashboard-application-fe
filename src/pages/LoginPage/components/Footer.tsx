import { styled } from '@mui/material/styles';
import { Grid, Link } from '@mui/material';

const StyledFooter = styled(Grid)({
  marginTop: 'auto',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
});

function Footer() {
  const links = [
    { name: 'Terms of Service', link: 'link1' },
    { name: 'Support', link: 'link2' },
    { name: `© ${new Date().getFullYear()} Employee Map`, link: 'link3' },
  ];

  return (
    <StyledFooter container direction="row" spacing="20">
      {links.map((link, index) => {
        return (
          <Grid item key={index}>
            <Link href={link.link} sx={{ textDecoration: 'none' }}>
              {link.name}
            </Link>
          </Grid>
        );
      })}
    </StyledFooter>
  );
}

export default Footer;
