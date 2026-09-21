from django import forms


class ContactForm(forms.Form):
    name = forms.CharField(max_length=100, label="Your name", widget=forms.TextInput(attrs={"autocomplete": "name", "placeholder": "Your name"}))
    phone = forms.CharField(max_length=20, label="Phone number", widget=forms.TelInput(attrs={"autocomplete": "tel", "placeholder": "9911 256 384"}))
    service = forms.ChoiceField(
        choices=[
            ("Wedding photography", "Wedding photography"),
            ("Pre-wedding shoot", "Pre-wedding shoot"),
            ("Portraits", "Portraits"),
            ("Baby and maternity", "Baby and maternity"),
            ("Product photography", "Product photography"),
        ],
        label="Service",
        widget=forms.Select(attrs={"autocomplete": "off"}),
    )
    message = forms.CharField(widget=forms.Textarea(attrs={"placeholder": "Tell us about your shoot", "rows": 5}), label="Tell us about your shoot")
