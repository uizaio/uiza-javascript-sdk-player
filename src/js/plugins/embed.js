const UzEmbed = {
  setup() {
    UzEmbed.ready.call(this);
  },

  ready() {
    const player = this;
    player.setUiza({
      api_embed: '__UIZA_EMBED_API__',
    });
    try {
      const param = {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify({ url: this.config.src }),
      };

      fetch(`${this.uiza.api_embed}/link`, param)
        .then(res => res.json())
        .then(data => {
          const shareLink = `${this.uiza.api_embed}/${data.code}`;
          player.setUiza({
            shareLink,
            embed: `<iframe width="1280" height="720" src="${shareLink}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`,
          });
        });
    } catch (e) {
      this.debug.log(e);
    }
  },
};

export default UzEmbed;
