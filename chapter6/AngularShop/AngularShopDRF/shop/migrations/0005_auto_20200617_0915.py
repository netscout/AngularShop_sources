# Generated by Django 3.0.7 on 2020-06-17 00:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0004_auto_20200617_0911'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='created_Date',
            new_name='created_date',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='modified_Date',
            new_name='modified_date',
        ),
    ]