# Mobile App - Branding Colors

## Logo "Athlifyr" na Top Bar

### Gradiente do Texto

O logo "Athlifyr" na top bar da aplicação móvel utiliza um **gradiente linear horizontal** (esquerda → direita).

#### Cores

```
Início (esquerda):  #f5c356  (accent - dourado/golden)
Fim (direita):      #f5c356B3 (accent com 70% opacidade)
```

#### Código de Referência

**Ficheiro:** `/mobile/src/components/HeaderLogo.tsx`

**React Native (LinearGradient):**
```tsx
<LinearGradient
  colors={['#f5c356', '#f5c356B3']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
/>
```

Ou usando a constante do tema:
```tsx
<LinearGradient
  colors={[theme.colors.accent, `${theme.colors.accent}B3`]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
/>
```

**CSS (Web):**
```css
background: linear-gradient(90deg, #f5c356 0%, #f5c356B3 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Propriedades do Texto

```tsx
{
  fontSize: 24,
  fontWeight: '700',      // bold
  letterSpacing: -0.5,
  color: 'black'          // Required for MaskedView mask
}
```

### Definição no Theme

**Ficheiro:** `/mobile/src/constants/theme.ts`

```typescript
// Accent — from CSS --p-golden: 41 89% 65%
accent: "#f5c356",
accentForeground: "#131820",
```

### HSL

```
hsl(41, 89%, 65%)
```

---

## Outras Cores da Marca

### Primary (Brand Orange)

```
Primary:       #e57b2a  (from CSS --p-brand: 26 78% 53%)
Primary Light: #fde3c9
Primary Dark:  #a5501a
```

### Accent (Golden)

```
Accent:            #f5c356  (from CSS --p-golden: 41 89% 65%)
Accent Foreground: #131820
```

### Secondary

```
Secondary:       #67717e
Secondary Light: #f3f5f6
Secondary Dark:  #1f252e
```

### Semantic Colors

```
Success: #10b981 (green)
Warning: #f59e0b (amber)
Error:   #ef4343 (red)
Info:    #aadeee (light blue)
```

### UI Colors

```
Background:           #ffffff (white)
Background Secondary: #f3f5f6 (light gray)
Text:                 #1f252e (dark)
Text Secondary:       #67717e (gray)
Border:               #e5e9ec (light gray)
```

---

## Uso

Para replicar o logo "Athlifyr" noutro local:

1. Use o componente `<HeaderLogo />` diretamente
2. Ou copie o gradiente `[theme.colors.accent, theme.colors.accent + 'B3']`
3. Aplique com `LinearGradient` e `MaskedView` para o efeito de texto gradiente

### Exemplo de Implementação

```tsx
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "@/src/constants/theme";

<MaskedView
  maskElement={<Text style={styles.logoText}>Athlifyr</Text>}
>
  <LinearGradient
    colors={[theme.colors.accent, `${theme.colors.accent}B3`]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.gradient}
  />
</MaskedView>
```

---

**Última atualização:** 19 de Fevereiro de 2026
