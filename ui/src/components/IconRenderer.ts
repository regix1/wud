import { defineComponent } from "vue";
import { getInlineSvgIcon } from "@/components/svg-icon-paths";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: 24,
    },
    marginRight: {
      type: [String, Number],
      default: 8,
    },
  },

  computed: {
    normalizedIcon() {
      if (!this.icon) return '';
      return this.icon
        .replace("mdi:", "mdi-")
        .replace("fa:", "fa-")
        .replace("fab:", "fab-")
        .replace("far:", "far-")
        .replace("fas:", "fas-")
        .replace("si:", "si-");
    },

    inlineSvg() {
      if (!this.icon) return undefined;
      return getInlineSvgIcon(this.normalizedIcon);
    },

    inlineSvgViewBox() {
      if (!this.inlineSvg) return '';
      const parts = this.inlineSvg.viewBox.split(' ').map(Number);
      const pad = parts[2] * 0.12;
      return `${parts[0] - pad} ${parts[1] - pad} ${parts[2] + pad * 2} ${parts[3] + pad * 2}`;
    },

    isHomarrIcon() {
      return this.icon && (this.icon.startsWith("hl-") || this.icon.startsWith("hl:"));
    },

    isSelfhstIcon() {
      return this.icon && (this.icon.startsWith("sh-") || this.icon.startsWith("sh:"));
    },

    isSimpleIcon() {
      return this.normalizedIcon && this.normalizedIcon.startsWith("si-");
    },

    homarrIconUrl() {
      const iconName = this.icon.replace("hl-", "").replace("hl:", "");
      return `https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/${iconName}.png`;
    },

    selfhstIconUrl() {
      const iconName = this.icon.replace("sh-", "").replace("sh:", "");
      return `https://cdn.jsdelivr.net/gh/selfhst/icons/png/${iconName}.png`;
    },

    simpleIconUrl() {
      const iconName = this.normalizedIcon.replace("si-", "");
      return `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${iconName}.svg`;
    },

    iconStyle() {
      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        marginRight: `${this.marginRight}px`,
        verticalAlign: 'middle',
      };
    },
  },
});
