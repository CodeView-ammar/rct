# Generated by Django 5.0.6 on 2024-06-09 23:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('init_input', '0008_remove_tracking_reference_tracking_division_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tracking',
            old_name='Calculated',
            new_name='calculated',
        ),
        migrations.RenameField(
            model_name='tracking',
            old_name='Subject',
            new_name='subject',
        ),
        migrations.AlterField(
            model_name='tracking',
            name='semester',
            field=models.CharField(choices=[('first', 'First semester'), ('second', 'Second semester')], default='first', max_length=10, verbose_name='Semester'),
        ),
        migrations.AlterField(
            model_name='trainer',
            name='name_job',
            field=models.CharField(choices=[('مدرب ب', '1'), ('2', 'مدرب أ'), ('مدرب اول ب', '3'), ('4', 'مدرب اول أ'), ('كبير المدربين', '5')], default='3', max_length=50, verbose_name='name'),
        ),
    ]
