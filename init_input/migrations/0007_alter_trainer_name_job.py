# Generated by Django 5.0.6 on 2024-06-09 23:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('init_input', '0006_alter_trainer_name_job'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trainer',
            name='name_job',
            field=models.CharField(choices=[('1', 'مدرب ب'), ('مدرب أ', '2'), ('مدرب اول ب', '3'), ('4', 'مدرب اول أ'), ('5', 'كبير المدربين')], default='3', max_length=50, verbose_name='name'),
        ),
    ]
