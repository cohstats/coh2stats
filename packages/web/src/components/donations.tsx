export const Donation = () => {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="hosted_button_id" value="879TFKUE62298" />
      <input
        type="image"
        src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
        name="submit"
        title="PayPal"
        alt="Donate with PayPal button"
      />
      <img alt="" src="https://www.paypal.com/en_CZ/i/scr/pixel.gif" width="1" height="1" />
    </form>
  );
};
