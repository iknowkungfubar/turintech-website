#!/usr/bin/env python3
"""Generate a simple terminal-style SVG screenshot from CLI --help output."""
import sys
import html
import textwrap

def generate_svg(title, help_text, width=80, height=24):
    """Generate a terminal-styled SVG from help text."""
    lines = help_text.rstrip().split('\n')
    
    prompt = "$"
    term_bg = "#1e1e2e"
    title_bar_bg = "#181825"
    title_text_color = "#cdd6f4"
    text_color = "#cdd6f4"
    prompt_color = "#a6e3a1"
    cmd_color = "#89b4fa"
    
    # Calculate needed height
    content_height = len(lines) + 3  # header + prompt line + content
    
    line_height_px = 20
    padding_x = 16
    padding_y = 16
    title_bar_height = 28
    border_radius = 8
    
    svg_width = width * 8.5 + padding_x * 2
    svg_height = content_height * line_height_px + padding_y * 2 + title_bar_height
    
    svg = []
    svg.append(f'<svg xmlns="http://www.w3.org/2000/svg" width="{svg_width:.0f}" height="{svg_height:.0f}" viewBox="0 0 {svg_width:.0f} {svg_height:.0f}">')
    svg.append(f'  <defs>')
    svg.append(f'    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">')
    svg.append(f'      <stop offset="0%" stop-color="{title_bar_bg}"/>')
    svg.append(f'      <stop offset="100%" stop-color="{term_bg}"/>')
    svg.append(f'    </linearGradient>')
    svg.append(f'  </defs>')
    
    # Window background with border
    svg.append(f'  <rect width="100%" height="100%" rx="{border_radius}" fill="{title_bar_bg}" stroke="#45475a" stroke-width="1"/>')
    svg.append(f'  <rect x="0" y="{title_bar_height}" width="100%" height="{svg_height - title_bar_height}" fill="{term_bg}" rx="0"/>')
    svg.append(f'  <rect x="0" y="{title_bar_height}" width="100%" height="{svg_height - title_bar_height}" fill="url(#bg)" opacity="0.3"/>')
    
    # Traffic lights
    dot_y = title_bar_height / 2 - 3
    svg.append(f'  <circle cx="{padding_x}" cy="{dot_y}" r="5" fill="#f38ba8"/>')
    svg.append(f'  <circle cx="{padding_x + 18}" cy="{dot_y}" r="5" fill="#fab387"/>')
    svg.append(f'  <circle cx="{padding_x + 36}" cy="{dot_y}" r="5" fill="#a6e3a1"/>')
    
    # Title
    svg.append(f'  <text x="{(svg_width) / 2:.0f}" y="{dot_y + 5}" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" fill="{title_text_color}">{html.escape(title)}</text>')
    
    y = title_bar_height + padding_y + line_height_px
    
    # First line: command prompt
    svg.append(f'  <text x="{padding_x}" y="{y}" font-family="monospace" font-size="13" fill="{prompt_color}">{prompt}</text>')
    svg.append(f'  <text x="{padding_x + 12}" y="{y}" font-family="monospace" font-size="13" fill="{cmd_color}">{html.escape(lines[0] if lines else "")}</text>')
    y += line_height_px * 1.5
    
    # Rest of help text
    for line in lines[1:]:
        if line.strip() == '':
            y += line_height_px * 0.5
            continue
        escaped = html.escape(line)
        svg.append(f'  <text x="{padding_x + 12}" y="{y}" font-family="monospace" font-size="13" fill="{text_color}">{escaped}</text>')
        y += line_height_px
    
    svg.append('</svg>')
    return '\n'.join(svg)

if __name__ == '__main__':
    title = sys.argv[1] if len(sys.argv) > 1 else "Terminal"
    text = sys.stdin.read()
    print(generate_svg(title, text))
