import {Link as RouterLink} from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  type SxProps,
  type Theme,
  type TypographyProps,
} from '@mui/material';

interface NimbusLinkCardBaseProps {
  title: string;
  description: string;
  titleVariant?: TypographyProps['variant']; // Defaults to 'h5'.
  sx?: SxProps<Theme>;
}

export type NimbusLinkCardProps = NimbusLinkCardBaseProps &
  ({to: string; href?: never} | {href: string; to?: never});

/**
 * A card linking to a sub-app or sub-page, used by app landing pages to list
 * what's available. Pass exactly one of `to` (in-app route) or `href`
 * (external URL) — enforced at the type level.
 */
export function NimbusLinkCard(props: NimbusLinkCardProps) {
  const {title, description, titleVariant = 'h5', sx} = props;

  const content = (
    <CardContent>
      <Typography variant={titleVariant} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  );

  return (
    <Card sx={sx}>
      {props.to !== undefined ? (
        <CardActionArea component={RouterLink} to={props.to}>
          {content}
        </CardActionArea>
      ) : (
        <CardActionArea href={props.href}>{content}</CardActionArea>
      )}
    </Card>
  );
}
